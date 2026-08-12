import { el } from "../dom.js";
import { getState } from "../../core/state.js";
import { showScreen } from "../../core/router.js";
import { pickCaseForPlay, applyCaseResult } from "../../game/caseRunner.js";
import { tierLabel } from "../../game/safety.js";
import { buildDaily, completeDaily } from "../../modes/daily.js";
import { profileById } from "../../data/patientProfiles.js";
import { save } from "../../storage/save.js";
import { play } from "../../audio/sound.js";
import { showToast } from "../components/toast.js";

const flow = { mode: "sim", caseRecord: null, step: "patient", choiceId: null, selected: [], result: null };

export function startCase(mode) {
  flow.mode = mode;
  flow.caseRecord = pickCaseForPlay(getState(), { mode });
  if (!flow.caseRecord) {
    showToast("No cases available yet.", "error");
    showScreen(mode === "daily" ? "daily" : "pharmacy");
    return;
  }
  flow.step = "patient";
  flow.choiceId = null;
  flow.selected = [];
  flow.result = null;
  showScreen("case");
}

export function render(container) {
  if (!flow.caseRecord) {
    container.append(el("div", { class: "screen", text: "No case loaded." }));
    return;
  }
  container.append(el("div", { class: "screen case" }, [
    el("div", { class: "pharmacy-top" }, [
      el("button", { class: "btn-icon", text: "‹", "aria-label": "Back", onclick: back }),
      el("h1", { class: "screen-title", text: caseTitle() }),
    ]),
    renderStep(),
  ]));
}

function caseTitle() {
  const c = flow.caseRecord;
  if (flow.mode === "daily") return `Daily ${Math.min(flowIndex() + 1, 5)}/5`;
  if (c.difficulty === "boss") return "Boss Case";
  return c.difficulty.charAt(0).toUpperCase() + c.difficulty.slice(1) + " Case";
}

function flowIndex() {
  return getState().daily.index ?? 0;
}

function back() {
  play("click");
  showScreen(flow.mode === "daily" ? "daily" : "pharmacy");
}

function renderStep() {
  if (flow.step === "patient") return patientStep();
  if (flow.step === "decision") return decisionStep();
  if (flow.step === "counselling") return counsellingStep();
  return resultStep();
}

function patientStep() {
  const c = flow.caseRecord;
  const p = c.patient;
  const profile = profileById(p.profile);
  return el("div", { class: "case-step" }, [
    el("div", { class: "card patient-card" }, [
      el("div", { class: "patient-avatar", html: patientSvg(p.sex) }),
      el("h2", { class: "card-title", text: c.title }),
      el("p", { class: "patient-line", text: `${profile.name} · ${p.age} · ${p.sex}` }),
      el("p", { class: "patient-line", text: `"${p.complaint}"` }),
      p.history ? el("p", { class: "patient-line muted", text: `Current medicines: ${p.history}` }) : null,
      (p.allergies && p.allergies.length) ? el("p", { class: "patient-line warn", text: `Allergies: ${p.allergies.join(", ")}` }) : null,
    ]),
    el("button", { class: "btn-primary step-btn", text: "Understand the case", onclick: () => { play("click"); flow.step = "decision"; rerender(); } }),
  ]);
}

function decisionStep() {
  const c = flow.caseRecord;
  return el("div", { class: "case-step" }, [
    el("h2", { class: "step-title", text: "What is the best pharmacy action?" }),
    el("div", { class: "choice-list" }, c.choices.map((ch) =>
      el("button", { class: "btn-choice", text: ch.label, onclick: () => { play("click"); flow.choiceId = ch.id; flow.step = "counselling"; rerender(); } })
    )),
  ]);
}

function counsellingStep() {
  const c = flow.caseRecord;
  const toggles = [];
  return el("div", { class: "case-step" }, [
    el("h2", { class: "step-title", text: "Safety check & patient counselling" }),
    el("div", { class: "safety-note" }, (c.safetyChecks ?? []).map((s) =>
      el("p", { class: "safety-check", text: s.detail })
    )),
    el("p", { class: "step-hint", text: "Select the correct counselling points (at least the two right ones):" }),
    el("div", { class: "choice-list" }, (c.counselling ?? []).map((pt) => {
      const btn = el("button", { class: "btn-choice btn-select", text: pt.label, onclick: () => toggleSelect(pt.id) });
      toggles.push({ id: pt.id, btn });
      return btn;
    })),
    el("button", { class: "btn-primary step-btn", text: "Finish case", onclick: () => finishCase() }),
  ]);
}

function toggleSelect(id) {
  const idx = flow.selected.indexOf(id);
  if (idx >= 0) flow.selected.splice(idx, 1);
  else flow.selected.push(id);
  rerender();
}

function finishCase() {
  const c = flow.caseRecord;
  const state = getState();
  const result = applyCaseResult(state, c, { choiceId: flow.choiceId, selectedIds: flow.selected });
  flow.result = result;

  if (flow.mode === "daily") {
    state.daily.index += 1;
    state.daily.score += result.rewards.xp;
    if (state.daily.index >= state.daily.caseIds.length) {
      const bonus = completeDaily(state);
      flow.dailyBonus = bonus;
    }
  }

  save(state);
  play(result.finalTier === "best" || result.finalTier === "safe" ? "reward" : "incorrect");
  flow.step = "result";
  rerender();
}

function resultStep() {
  const r = flow.result;
  const state = getState();
  const factCard = r.unlockedCards[0] ?? null;

  const rows = [
    el("p", { class: `tier tier-${r.finalTier}`, text: tierLabel(r.finalTier) }),
    el("div", { class: "reward-row", text: `+${r.rewards.xp} XP   +${r.rewards.coins} coins   ${r.rewards.rep >= 0 ? "+" : ""}${r.rewards.rep} reputation` }),
  ];
  if (!r.counselling.ok) rows.push(el("p", { class: "result-note", text: "Counselling points were not all correct — review the advice below." }));

  const extras = [];
  if (r.levelUps.length) {
    extras.push(el("div", { class: "result-banner", text: `LEVEL UP! → Level ${r.levelUps[r.levelUps.length - 1].level} (+${r.levelUps.reduce((s, l) => s + l.coins, 0)} coins)` }));
    for (const lu of r.levelUps) play("levelup");
  }
  if (r.achievements.length) {
    extras.push(el("div", { class: "result-banner", text: `Achievement: ${r.achievements.map((a) => a.name).join(", ")}` }));
    play("achievement");
  }
  if (flow.dailyBonus) {
    extras.push(el("div", { class: "result-banner", text: `Daily complete! +${flow.dailyBonus.xp} XP +${flow.dailyBonus.coins} coins · Streak ${state.player.streak}` }));
    play("levelup");
  }

  return el("div", { class: "case-step" }, [
    el("div", { class: "card result-card" }, rows),
    el("div", { class: "card explanation-card" }, [
      el("h3", { class: "card-title", text: "Why?" }),
      el("p", { text: flow.caseRecord.explanation }),
    ]),
    factCard ? el("div", { class: "card fact-card" }, [
      el("h3", { class: "card-title", text: factCard.title }),
      el("p", { class: "fact-line", text: factCard.fact }),
      el("p", { class: "fact-detail", text: factCard.detail }),
    ]) : null,
    ...extras,
    el("button", { class: "btn-primary step-btn", text: nextLabel(), onclick: () => { play("click"); next(); } }),
  ]);
}

function nextLabel() {
  if (flow.mode === "daily") return getState().daily.index >= getState().daily.caseIds.length ? "Finish daily" : "Next case";
  return "Back to pharmacy";
}

function next() {
  if (flow.mode === "daily" && getState().daily.index < getState().daily.caseIds.length) {
    startCase("daily");
    return;
  }
  showScreen(flow.mode === "daily" ? "daily" : "pharmacy");
}

function rerender() {
  const container = document.getElementById("app");
  render(container);
}

function patientSvg(sex) {
  return `<svg viewBox="0 0 48 48" width="56" height="56" aria-hidden="true">
    <circle cx="24" cy="16" r="9" fill="#9fd8cf"/>
    <path d="M7 46 a17 17 0 0 1 34 0 z" fill="#9fd8cf"/>
  </svg>`;
}
