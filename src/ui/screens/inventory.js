import { el } from "../dom.js";
import { getState } from "../../core/state.js";
import { showScreen } from "../../core/router.js";
import { showToast } from "../components/toast.js";
import { play } from "../../audio/sound.js";
import { save } from "../../storage/save.js";
import {
  medicineById,
  inventorySlots,
  usedSlots,
  stockQty,
  restockCost,
  restockableMeds,
  processExpiry,
  addStock,
} from "../../systems/inventory.js";
import { spendCoins } from "../../systems/coins.js";

export function render(container) {
  const state = getState();
  const expired = processExpiry(state);
  if (expired.length) {
    showToast(`${expired.length} item(s) expired and were removed.`, "error");
    save(state);
  }

  const restockables = restockableMeds(state);

  container.append(el("div", { class: "screen" }, [
    el("div", { class: "pharmacy-top" }, [
      el("button", { class: "btn-icon", text: "‹", "aria-label": "Back", onclick: () => { play("click"); showScreen("pharmacy"); } }),
      el("h1", { class: "screen-title", text: "Inventory" }),
    ]),
    el("p", { class: "bank-summary", text: `Slots ${usedSlots(state)}/${inventorySlots(state)} · ${state.player.coins} coins` }),
    el("h2", { class: "section-title", text: "Stock & restock" }),
    el("div", { class: "inventory-list" }, restockables.map((med) => {
      const qty = stockQty(state, med.id);
      const cost = restockCost(state, med.id, 5);
      const low = qty > 0 && qty < 3;
      return el("div", { class: "inventory-item" }, [
        el("div", { class: "inventory-info" }, [
          el("div", { class: "inventory-name", text: `${med.genericName}${low ? " ⚠ low" : ""}` }),
          el("div", { class: "inventory-sub", text: `${med.dosageForm} · ${med.drugClass}` }),
          el("div", { class: `inventory-qty${qty === 0 ? " out" : ""}`, text: qty > 0 ? `In stock: ${qty}` : "Out of stock" }),
        ]),
        el("button", {
          class: "btn-ghost btn-small",
          text: `Restock +5 (${cost}¢)`,
          onclick: () => restock(state, med.id, cost),
        }),
      ]);
    })),
  ]));
}

function restock(state, medId, cost) {
  if (!spendCoins(state, cost)) {
    showToast("Not enough coins.", "error");
    return;
  }
  addStock(state, medId, 5);
  save(state);
  play("reward");
  showToast(`Restocked ${medicineById(medId).genericName} +5.`, "success");
  showScreen("inventory");
}
