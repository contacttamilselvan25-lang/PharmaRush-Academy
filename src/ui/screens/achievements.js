import { el } from "../dom.js";
import { getState } from "../../core/state.js";
import { showScreen } from "../../core/router.js";
import { play } from "../../audio/sound.js";
import { achievements } from "../../data/achievements.js";

export function render(container) {
  const state = getState();
  const unlockedCount = state.achievements.length;

  container.append(el("div", { class: "screen" }, [
    el("div", { class: "pharmacy-top" }, [
      el("button", { class: "btn-icon", text: "‹", "aria-label": "Back", onclick: () => { play("click"); showScreen("menu"); } }),
      el("h1", { class: "screen-title", text: "Achievements" }),
    ]),
    el("p", { class: "bank-summary", text: `${unlockedCount}/${achievements.length} unlocked` }),
    el("div", { class: "achievement-list" }, achievements.map((a) => {
      const got = state.achievements.includes(a.id);
      return el("div", { class: got ? "achievement-item" : "achievement-item ach-locked" }, [
        el("div", { class: "ach-icon", text: got ? "★" : "☆" }),
        el("div", { class: "ach-info" }, [
          el("div", { class: "ach-name", text: a.name }),
          el("div", { class: "ach-desc", text: a.desc }),
        ]),
        got ? el("div", { class: "ach-reward", text: `+${a.rewards.xp}XP +${a.rewards.coins}¢` }) : null,
      ]);
    })),
  ]));
}
