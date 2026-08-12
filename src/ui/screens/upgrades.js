import { el } from "../dom.js";
import { getState } from "../../core/state.js";
import { showScreen } from "../../core/router.js";
import { showToast } from "../components/toast.js";
import { play } from "../../audio/sound.js";
import { save } from "../../storage/save.js";
import { upgrades, upgradeCost } from "../../data/upgrades.js";
import { spendCoins } from "../../systems/coins.js";
import { levelForXp } from "../../systems/xp.js";

export function render(container) {
  const state = getState();
  const level = levelForXp(state.player.xp);

  container.append(el("div", { class: "screen" }, [
    el("div", { class: "pharmacy-top" }, [
      el("button", { class: "btn-icon", text: "‹", "aria-label": "Back", onclick: () => { play("click"); showScreen("pharmacy"); } }),
      el("h1", { class: "screen-title", text: "Upgrades" }),
    ]),
    el("p", { class: "bank-summary", text: `${state.player.coins} coins` }),
    el("div", { class: "upgrade-list" }, upgrades.map((u) => {
      const tier = state.upgrades[u.id] ?? 0;
      const maxed = tier >= u.maxTier;
      const cost = maxed ? 0 : upgradeCost(u, tier + 1);
      const locked = level < u.requiresLevel;
      return el("div", { class: "upgrade-item" }, [
        el("div", { class: "upgrade-info" }, [
          el("div", { class: "upgrade-name", text: `${u.name} (Tier ${tier}/${u.maxTier})` }),
          el("div", { class: "upgrade-desc", text: u.desc }),
          locked ? el("div", { class: "upgrade-req", text: `Requires level ${u.requiresLevel}` }) : null,
        ]),
        maxed
          ? el("span", { class: "upgrade-max", text: "MAX" })
          : el("button", {
              class: locked ? "btn-ghost btn-small btn-disabled" : "btn-ghost btn-small",
              text: locked ? "Locked" : `Upgrade (${cost}¢)`,
              onclick: () => buy(state, u, tier + 1, cost),
            }),
      ]);
    })),
  ]));
}

function buy(state, upgrade, newTier, cost) {
  const level = levelForXp(state.player.xp);
  if (level < upgrade.requiresLevel) {
    showToast("Level not high enough.", "error");
    return;
  }
  if (!spendCoins(state, cost)) {
    showToast("Not enough coins.", "error");
    return;
  }
  state.upgrades[upgrade.id] = newTier;
  save(state);
  play("levelup");
  showToast(`${upgrade.name} upgraded to tier ${newTier}!`, "success");
  showScreen("upgrades");
}
