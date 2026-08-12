import { el } from "../dom.js";
import { levelForXp, xpIntoLevel, xpNeededForNextLevel } from "../../systems/xp.js";
import { titleForLevel } from "../../systems/level.js";

export function renderStatBar(state) {
  const xp = state.player.xp;
  const level = levelForXp(xp);
  const into = xpIntoLevel(xp);
  const needed = xpNeededForNextLevel(xp);
  const pct = needed > 0 ? Math.min(100, Math.round((into / needed) * 100)) : 100;

  return el("div", { class: "stat-bar" }, [
    el("div", { class: "stat stat-level" }, [
      el("span", { class: "stat-label", text: "LVL" }),
      el("span", { class: "stat-value stat-value-level", text: String(level) }),
    ]),
    el("div", { class: "stat stat-xp" }, [
      el("div", { class: "stat-title", text: titleForLevel(level) }),
      el("div", { class: "xp-track" }, [
        el("div", { class: "xp-fill", style: `width:${pct}%` }),
      ]),
    ]),
    el("div", { class: "stat" }, [
      el("span", { class: "stat-icon", text: "¢" }),
      el("span", { class: "stat-value", text: String(state.player.coins) }),
    ]),
    el("div", { class: "stat" }, [
      el("span", { class: "stat-icon stat-icon-rep", text: "★" }),
      el("span", { class: "stat-value", text: String(state.player.reputation) }),
    ]),
  ]);
}