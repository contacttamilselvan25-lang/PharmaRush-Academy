import { REWARD_BASE, OUTCOME_MULTIPLIER, BALANCE } from "../config.js";

export function baseCoins(difficulty) {
  return REWARD_BASE[difficulty]?.coins ?? REWARD_BASE.normal.coins;
}

export function coinsForCase({ difficulty, tier, comboMult = 1 }) {
  const base = baseCoins(difficulty);
  const factor = OUTCOME_MULTIPLIER[tier]?.coins ?? 0;
  let coins = Math.round(base * factor * comboMult);
  if (tier === "best") coins += BALANCE.PERFECT_COIN_BONUS;
  return Math.max(0, coins);
}

export function addCoins(state, amount) {
  const delta = Math.max(0, amount);
  state.player.coins += delta;
  return state.player.coins;
}

export function spendCoins(state, amount) {
  const cost = Math.max(0, amount);
  if (state.player.coins < cost) return false;
  state.player.coins -= cost;
  return true;
}
