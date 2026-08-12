import { cases } from "../data/cases.js";
import { levelForXp } from "../systems/xp.js";
import { isBossLevel } from "../systems/level.js";

export function isBossUnlocked(state) {
  return isBossLevel(levelForXp(state.player.xp));
}

export function pickBossCase(state) {
  const bossCases = cases.filter((c) => c.difficulty === "boss");
  if (!bossCases.length) return null;
  const level = levelForXp(state.player.xp);
  return bossCases[(level / 5 - 1) % bossCases.length] ?? bossCases[0];
}
