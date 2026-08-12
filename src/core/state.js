import { BALANCE } from "../config.js";

let current = null;

export function getState() {
  return current;
}

export function setState(state) {
  current = state;
  return current;
}

const DAY_MS = 86400000;

const STARTER_STOCK = [
  { medId: "paracetamol_500", qty: 20 },
  { medId: "ibuprofen_400", qty: 10 },
  { medId: "amlo_5", qty: 15 },
  { medId: "metf_500", qty: 15 },
  { medId: "amox_250", qty: 10 },
  { medId: "cetirizine_10", qty: 12 },
  { medId: "omeprazole_20", qty: 10 },
  { medId: "salbutamol_100", qty: 8 },
];

function starterInventory() {
  const now = Date.now();
  return STARTER_STOCK.map((s) => ({
    medId: s.medId,
    qty: s.qty,
    expiry: now + 300 * DAY_MS,
  }));
}

export function defaultState() {
  return {
    version: 1,
    player: {
      level: 1,
      xp: 0,
      coins: BALANCE.STARTING_COINS,
      reputation: BALANCE.STARTING_REPUTATION,
      streak: 0,
      lastDaily: null,
    },
    inventory: starterInventory(),
    upgrades: {},
    unlocked: { medicines: [], cases: [] },
    achievements: [],
    knowledge: { reviewBoxes: {}, mastery: {} },
    stats: {
      patientsServed: 0,
      casesCompleted: 0,
      perfectCases: 0,
      accuracy: 0,
      interactionsCaught: 0,
      adrCaught: 0,
      zeroErrorStreak: 0,
      bossCompleted: 0,
      perSubject: {},
    },
    daily: { date: null, caseIds: [], index: 0, completed: false, score: 0 },
    settings: { sound: true, animations: true },
  };
}
