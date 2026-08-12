import { el } from "../dom.js";
import { getState } from "../../core/state.js";
import { showScreen } from "../../core/router.js";
import { play } from "../../audio/sound.js";
import { buildDaily, isDailyDoneToday } from "../../modes/daily.js";
import { startCase } from "./case.js";

export function render(container) {
  const state = getState();
  const daily = buildDaily(state);
  const done = isDailyDoneToday(state);

  container.append(el("div", { class: "screen" }, [
    el("div", { class: "pharmacy-top" }, [
      el("button", { class: "btn-icon", text: "‹", "aria-label": "Back", onclick: () => { play("click"); showScreen("menu"); } }),
      el("h1", { class: "screen-title", text: "Daily Challenge" }),
    ]),
    el("div", { class: "card daily-card" }, [
      el("p", { class: "daily-big", text: done ? "Done for today!" : `Case ${Math.min(daily.index + 1, 5)} of ${daily.caseIds.length}` }),
      el("p", { class: "patient-line muted", text: `Streak: ${state.player.streak} day${state.player.streak === 1 ? "" : "s"} · Score: ${daily.score}` }),
      el("p", { class: "patient-line muted", text: "Bonus: +100 XP +50 coins on completion" }),
      el("button", {
        class: done ? "btn-ghost btn-disabled" : "btn-primary daily-play",
        text: done ? "Completed" : "Start today's cases",
        onclick: () => { play("click"); startCase("daily"); },
      }),
    ]),
    el("div", { class: "daily-track" }, daily.caseIds.map((id, i) =>
      el("div", { class: i < daily.index ? "dot dot-done" : "dot", text: i < daily.index ? "✓" : "" })
    )),
  ]));
}
