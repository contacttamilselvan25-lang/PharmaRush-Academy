import { cases } from "../data/cases.js";
import { BALANCE } from "../config.js";
import { seededRng, shuffle, dateStr } from "../core/utils.js";

export const DAILY_CASE_COUNT = BALANCE.DAILY_CASES_PER_DAY;

function yesterdayStr() {
  const d = new Date(Date.now() - 86400000);
  return dateStr(d);
}

export function isDailyDoneToday(state) {
  return state.daily.completed && state.daily.date === dateStr();
}

export function buildDaily(state) {
  const today = dateStr();
  if (state.daily.date === today && state.daily.caseIds.length) return state.daily;
  const pool = cases.filter((c) => c.difficulty !== "boss");
  const rng = seededRng(hashDate(today));
  const picked = shuffle(pool, rng).slice(0, DAILY_CASE_COUNT);
  state.daily = {
    date: today,
    caseIds: picked.map((c) => c.caseId),
    index: 0,
    completed: false,
    score: 0,
  };
  return state.daily;
}

function hashDate(s) {
  let h = 2166136261;
  for (let i = 0; i < s.length; i++) {
    h ^= s.charCodeAt(i);
    h = Math.imul(h, 16777619);
  }
  return h >>> 0;
}

export function completeDaily(state) {
  const today = dateStr();
  if (state.player.lastDaily === today) {
    // already completed today; no extra streak
  } else if (state.player.lastDaily === yesterdayStr()) {
    state.player.streak += 1;
  } else {
    state.player.streak = 1;
  }
  state.player.lastDaily = today;
  state.daily.completed = true;

  const bonus = {
    xp: BALANCE.DAILY_BONUS_XP,
    coins: BALANCE.DAILY_BONUS_COINS,
  };
  state.player.xp += bonus.xp;
  state.player.coins += bonus.coins;
  return bonus;
}
