import { el } from "../dom.js";
import { getState } from "../../core/state.js";
import { showScreen } from "../../core/router.js";
import { play } from "../../audio/sound.js";
import { levelForXp, xpIntoLevel, xpNeededForNextLevel } from "../../systems/xp.js";
import { titleForLevel } from "../../systems/level.js";
import { weakestSubject } from "../../learning/weakTopic.js";
import { unlockedCards } from "../../learning/knowledgeBank.js";
import { masteredCount } from "../../learning/spacedRepetition.js";

export function render(container) {
  const state = getState();
  const s = state.stats;
  const level = levelForXp(state.player.xp);
  const into = xpIntoLevel(state.player.xp);
  const needed = xpNeededForNextLevel(state.player.xp);
  const weak = weakestSubject(state);

  const rows = [
    stat("Level", `${level} — ${titleForLevel(level)}`),
    stat("XP progress", `${into} / ${needed} to next level`),
    stat("Coins", String(state.player.coins)),
    stat("Reputation", String(state.player.reputation)),
    stat("Patients served", String(s.patientsServed)),
    stat("Cases completed", String(s.casesCompleted)),
    stat("Accuracy", `${s.accuracy}%`),
    stat("Perfect streak", String(s.zeroErrorStreak)),
    stat("Daily streak", String(state.player.streak)),
    stat("Knowledge cards", `${unlockedCards(state).length} unlocked · ${masteredCount(state)} mastered`),
    stat("Interactions caught", String(s.interactionsCaught)),
    stat("ADRs detected", String(s.adrCaught)),
  ];
  if (weak) rows.push(el("div", { class: "weak-topic" }, [
    el("h3", { text: `Your ${weak.subject} skills need practice.` }),
    el("p", { text: `${Math.round(weak.acc * 100)}% accuracy over ${weak.attempts} cases — replay cases and read its cards in the Knowledge Bank.` }),
  ]));

  container.append(el("div", { class: "screen" }, [
    el("div", { class: "pharmacy-top" }, [
      el("button", { class: "btn-icon", text: "‹", "aria-label": "Back", onclick: () => { play("click"); showScreen("menu"); } }),
      el("h1", { class: "screen-title", text: "Profile" }),
    ]),
    el("div", { class: "profile-list" }, rows),
  ]));
}

function stat(label, value) {
  return el("div", { class: "profile-row" }, [
    el("span", { class: "profile-label", text: label }),
    el("span", { class: "profile-value", text: value }),
  ]);
}
