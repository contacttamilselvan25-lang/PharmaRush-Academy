import { medicines } from "../data/medicines.js";

const DAY_MS = 86400000;

export function medicineById(id) {
  return medicines.find((m) => m.id === id) ?? null;
}

export function itemExpired(item, now = Date.now()) {
  return now >= item.expiry;
}

export function baseSlots() {
  return 20;
}

export function inventorySlots(state) {
  return baseSlots() + 4 * (state.upgrades.shelves ?? 0);
}

export function usedSlots(state) {
  return state.inventory.filter((i) => i.qty > 0).length;
}

export function addStock(state, medId, qty) {
  const med = medicineById(medId);
  if (!med) return false;
  const storageTier = state.upgrades.storage ?? 0;
  const bonusMs = storageTier * 90 * DAY_MS;
  const item = state.inventory.find((i) => i.medId === medId);
  if (item) {
    item.qty += qty;
    if (!item.expiry || item.expiry <= Date.now()) item.expiry = Date.now() + med.expiryDays * DAY_MS + bonusMs;
  } else {
    state.inventory.push({ medId, qty, expiry: Date.now() + med.expiryDays * DAY_MS + bonusMs });
  }
  return true;
}

export function removeStock(state, medId, qty = 1) {
  const item = state.inventory.find((i) => i.medId === medId);
  if (!item || item.qty < qty) return false;
  item.qty -= qty;
  return true;
}

export function stockQty(state, medId) {
  return state.inventory.find((i) => i.medId === medId)?.qty ?? 0;
}

export function restockCost(state, medId, qty = 5) {
  const med = medicineById(medId);
  if (!med) return 0;
  const discountTier = state.upgrades.inventorySystem ?? 0;
  const discountPct = discountTier * 5;
  return Math.max(1, Math.round(med.cost * qty * (1 - discountPct / 100)));
}

export function processExpiry(state, now = Date.now()) {
  const expired = [];
  for (const item of state.inventory) {
    if (item.qty > 0 && item.expiry <= now) {
      expired.push({ medId: item.medId, qty: item.qty });
      item.qty = 0;
    }
  }
  return expired;
}

export function restockableMeds(state) {
  const owned = new Set(state.inventory.map((i) => i.medId));
  return medicines.filter((m) => owned.has(m.id) || m.difficulty <= 2);
}
