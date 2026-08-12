import { LEVEL_TITLES, BALANCE } from "../config.js";

export function titleForLevel(level) {
  let title = LEVEL_TITLES[1] ?? "Player";
  for (const [key, value] of Object.entries(LEVEL_TITLES)) {
    if (Number(key) <= level) title = value;
  }
  return title;
}

export function isMilestone(level) {
  return BALANCE.MILESTONE_LEVELS.includes(level);
}

export function isBossLevel(level) {
  return level > 0 && level % BALANCE.BOSS_EVERY_N_LEVELS === 0;
}

export function levelUpRewards(newLevel) {
  return {
    coins: isMilestone(newLevel) ? BALANCE.MILESTONE_COIN_REWARD : BALANCE.LEVEL_COIN_REWARD,
    milestone: isMilestone(newLevel),
  };
}
