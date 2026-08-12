export const upgrades = [
  {
    id: "shelves", name: "More Shelves", category: "growth", maxTier: 5, requiresLevel: 3,
    cost: (t) => 100 * t * t,
    effect: { inventorySlots: 4 },
    desc: "More stock variety and inventory space.",
  },
  {
    id: "inventorySystem", name: "Inventory System", category: "growth", maxTier: 5, requiresLevel: 4,
    cost: (t) => 50 * t * t,
    effect: { restockDiscountPct: 5 },
    desc: "Better stock tracking and cheaper restocking.",
  },
  {
    id: "storage", name: "Storage Upgrade", category: "growth", maxTier: 3, requiresLevel: 5,
    cost: (t) => 60 * t * t,
    effect: { expiryBonusDays: 90 },
    desc: "Better storage slows expiry loss.",
  },
  {
    id: "counsellingArea", name: "Counselling Area", category: "service", maxTier: 3, requiresLevel: 6,
    cost: (t) => 60 * t * t,
    effect: { satisfactionBonus: 1 },
    desc: "A quiet space boosts patient satisfaction.",
  },
  {
    id: "assistant", name: "Assistant", category: "service", maxTier: 3, requiresLevel: 10,
    cost: (t) => 150 * t * t,
    effect: { autoRestock: true },
    desc: "An assistant helps keep shelves stocked.",
  },
  {
    id: "equipment", name: "Lab Equipment", category: "service", maxTier: 3, requiresLevel: 8,
    cost: (t) => 100 * t * t,
    effect: { labUnlocked: true },
    desc: "Unlocks lab practice in later versions.",
  },
  {
    id: "decor", name: "Decor", category: "cosmetic", maxTier: 3, requiresLevel: 2,
    cost: (t) => 20 * t * t,
    effect: {},
    desc: "Make your pharmacy look nicer (cosmetic only).",
  },
];

export function upgradeById(id) {
  return upgrades.find((u) => u.id === id) ?? null;
}

export function upgradeCost(upgrade, tier) {
  return upgrade.cost(tier);
}

export default upgrades;
