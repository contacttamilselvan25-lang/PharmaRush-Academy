import { achievements } from "../data/achievements.js";
import { levelForXp } from "./xp.js";

export function statValue(state, stat) {
  const s = state.stats;
  switch (stat) {
    case "level":
      return levelForXp(state.player.xp);
    case "cardsUnlocked":
      return Object.keys(state.knowledge.mastery).filter((k) => state.knowledge.mastery[k]).length;
    default:
      return s[stat] ?? 0;
  }
}

export function evaluateCondition(state, condition) {
  const value = statValue(state, condition.stat);
  switch (condition.op) {
    case ">=":
      return value >= condition.value;
    case ">":
      return value > condition.value;
    case "===":
      return value === condition.value;
    default:
      return false;
  }
}

export function checkAchievements(state) {
  const unlocked = new Set(state.achievements);
  const newly = [];
  for (const ach of achievements) {
    if (unlocked.has(ach.id)) continue;
    if (evaluateCondition(state, ach.condition)) {
      state.achievements.push(ach.id);
      newly.push(ach);
    }
  }
  return newly;
}

export function isUnlocked(state, id) {
  return state.achievements.includes(id);
}

export function unlockedAchievements(state) {
  return achievements.filter((a) => state.achievements.includes(a.id));
}
