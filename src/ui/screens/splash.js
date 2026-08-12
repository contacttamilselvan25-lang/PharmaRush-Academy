import { el } from "../dom.js";
import { GAME_VERSION } from "../../config.js";
import { showScreen } from "../../core/router.js";

export function render(container) {
  container.append(
    el("div", { class: "screen splash" }, [
      el("div", { class: "splash-logo", html: crossMark() }),
      el("h1", { class: "splash-title", text: "PHARMA RUSH" }),
      el("p", { class: "splash-tagline", text: "Play. Practice. Learn." }),
      el("p", { class: "splash-hint", text: "Tap to continue" }),
      el("p", { class: "splash-version", text: `v${GAME_VERSION}` }),
    ])
  );

  let done = false;
  const go = () => {
    if (done) return;
    done = true;
    showScreen("menu");
  };
  container.addEventListener("click", go);
  setTimeout(go, 1500);
}

function crossMark() {
  return `<svg viewBox="0 0 64 64" width="72" height="72" aria-hidden="true">
    <rect x="4" y="4" width="56" height="56" rx="14" fill="#0b7a6f"/>
    <rect x="24" y="14" width="16" height="36" rx="8" fill="#ffffff"/>
    <rect x="14" y="24" width="36" height="16" rx="8" fill="#ffffff"/>
  </svg>`;
}