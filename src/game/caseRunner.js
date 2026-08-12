import { cases } from "../data/cases.js";
import { seededRng, shuffle } from "../core/utils.js";
import { levelForXp } from "../systems/xp.js";
import { computeRewards, applyRewards } from "../systems/rewards.js";
import { levelUpRewards } from "../systems/level.js";
import { tierOfChoice, downgradeTier, caughtStats } from "./safety.js";
import { counsellingResult } from "./counselling.js";
import { pickBossCase, isBossUnlocked } from "./boss.js";
import { unlockForCase } from "../learning/knowledgeBank.js";
import { checkAchievements } from "../systems/achievements.js";

function unlockMedicines(state, caseRecord) {
  const newly = [];
  for (const medId of caseRecord.relatedMedicines ?? []) {
    if (!state.unlocked.medicines.includes(medId)) {
      state.unlocked.medicines.push(medId);
      newly.push(medId);
    }
  }
  return newly;
}

function allowedSimCases(state) {
  const level = levelForXp(state.player.xp);
  return cases.filter((c) => {
    if (c.difficulty === "boss") return false;
    if (c.difficulty === "hard") return level >= 6;
    if (c.difficulty === "normal") return level >= 3;
    return c.difficulty === "easy";
  });
}

export function pickCaseForPlay(state, { mode = "sim", seed = null } = {}) {
  if (mode === "daily") {
    const ids = state.daily.caseIds;
    if (state.daily.index < ids.length) {
      return cases.find((c) => c.caseId === ids[state.daily.index]) ?? null;
    }
    return null;
  }
  if (mode === "boss") {
    if (!isBossUnlocked(state)) return null;
    return pickBossCase(state);
  }
  const pool = allowedSimCases(state);
  if (!pool.length) return null;
  const rng = seed != null ? seededRng(seed) : Math.random;
  return pool[Math.floor(rng() * pool.length)];
}

function recordStats(state, caseRecord, finalTier) {
  const s = state.stats;
  s.casesCompleted += 1;
  s.patientsServed += 1;
  if (finalTier === "best") {
    s.perfectCases += 1;
    s.zeroErrorStreak += 1;
  } else {
    s.zeroErrorStreak = 0;
  }
  if (caseRecord.difficulty === "boss") s.bossCompleted += 1;
  if (finalTier === "best") {
    const caught = caughtStats(caseRecord);
    s.interactionsCaught += caught.interactionsCaught;
    s.adrCaught += caught.adrCaught;
  }
  const subjectSet = new Set();
  for (const obj of caseRecord.objectives ?? []) subjectSet.add(obj.split(":")[0]);
  for (const subject of subjectSet) {
    const entry = (s.perSubject[subject] ??= { attempts: 0, correct: 0 });
    entry.attempts += 1;
    if (finalTier === "best") entry.correct += 1;
  }
  s.accuracy = s.casesCompleted ? Math.round((s.perfectCases / s.casesCompleted) * 100) : 0;
}

function applyLevelUps(state, oldXp) {
  const before = levelForXp(oldXp);
  const after = levelForXp(state.player.xp);
  const levelUps = [];
  for (let l = before + 1; l <= after; l++) {
    const r = levelUpRewards(l);
    state.player.coins += r.coins;
    levelUps.push({ level: l, coins: r.coins, milestone: r.milestone });
  }
  return levelUps;
}

export function applyCaseResult(state, caseRecord, { choiceId, selectedIds = [] } = {}) {
  const tier = tierOfChoice(caseRecord, choiceId);
  const counselling = counsellingResult(caseRecord, selectedIds);
  const finalTier = counselling.ok ? tier : downgradeTier(tier);
  const oldXp = state.player.xp;

  const rewards = computeRewards({ difficulty: caseRecord.difficulty, tier: finalTier });
  applyRewards(state, rewards);

  const unlockedMedicines = unlockMedicines(state, caseRecord);
  const unlockedCards = unlockForCase(state, caseRecord);
  recordStats(state, caseRecord, finalTier);
  const levelUps = applyLevelUps(state, oldXp);
  const achievements = checkAchievements(state);

  return {
    caseId: caseRecord.caseId,
    tier,
    finalTier,
    counselling,
    rewards,
    unlockedMedicines,
    unlockedCards,
    levelUps,
    achievements,
  };
}

export { shuffle };
