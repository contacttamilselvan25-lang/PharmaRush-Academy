import { el } from "../dom.js";
import { showScreen } from "../../core/router.js";
import { getState } from "../../core/state.js";
import { levelForXp } from "../../systems/xp.js";
import { titleForLevel } from "../../systems/level.js";
import { showToast } from "../components/toast.js";
import { play } from "../../audio/sound.js";

export function render(container) {
  const state = getState();
  const level = levelForXp(state.player.xp);

  container.append(
    el("div", { class: "screen menu" }, [
      el("div", { class: "menu-logo", html: crossMark() }),
      el("h1", { class: "menu-title", text: "PHARMA RUSH" }),
      el("p", { class: "menu-tagline", text: "Play. Practice. Learn." }),
      el("p", { class: "menu-player", text: `${titleForLevel(level)} · Level ${level}` }),
      el("div", { class: "menu-actions" }, [
        el("button", { class: "btn-primary", text: "Start Shift", onclick: () => { play("click"); showScreen("pharmacy"); } }),
        el("button", { class: "btn-ghost", text: "Daily Challenge", onclick: () => { play("click"); showScreen("daily"); } }),
        el("button", { class: "btn-ghost", text: "Knowledge Bank", onclick: () => { play("click"); showScreen("knowledgeBank"); } }),
        el("button", { class: "btn-ghost", text: "Profile", onclick: () => { play("click"); showScreen("profile"); } }),
        el("button", { class: "btn-ghost", text: "Achievements", onclick: () => { play("click"); showScreen("achievements"); } }),
        el("button", { class: "btn-ghost", text: "Settings", onclick: () => { play("click"); showScreen("settings"); } }),
      ]),
    ])
  );
}

function crossMark() {
  return `<svg viewBox="0 0 64 64" width="72" height="72" aria-hidden="true">
    <rect x="4" y="4" width="56" height="56" rx="14" fill="#0b7a6f"/>
    <rect x="24" y="14" width="16" height="36" rx="8" fill="#ffffff"/>
    <rect x="14" y="24" width="36" height="16" rx="8" fill="#ffffff"/>
  </svg>`;
}
