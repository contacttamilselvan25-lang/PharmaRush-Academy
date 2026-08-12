import { BALANCE, REWARD_BASE, OUTCOME_MULTIPLIER } from "../config.js";

export function xpForLevel(level) {
  return BALANCE.XP_PER_LEVEL_BASE * level;
}

export function xpToReachLevel(level) {
  const l = Math.max(1, level);
  return ((l - 1) * l * BALANCE.XP_PER_LEVEL_BASE) / 2;
}

export function levelForXp(xp) {
  const n = Math.floor(
    (1 + Math.sqrt(1 + (8 * Math.max(0, xp)) / BALANCE.XP_PER_LEVEL_BASE)) / 2
  );
  return Math.max(1, n);
}

export function xpIntoLevel(xp) {
  return Math.max(0, xp - xpToReachLevel(levelForXp(xp)));
}

export function xpNeededForNextLevel(xp) {
  return xpForLevel(levelForXp(xp));
}

export function xpForCase({ difficulty, tier }) {
  const base = REWARD_BASE[difficulty]?.xp ?? REWARD_BASE.normal.xp;
  const factor = OUTCOME_MULTIPLIER[tier]?.xp ?? 0;
  let xp = Math.round(base * factor);
  if (tier === "best") xp = Math.round(xp * (1 + BALANCE.PERFECT_XP_BONUS));
  return Math.max(0, xp);
}
