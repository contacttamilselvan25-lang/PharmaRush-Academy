export const GAME_VERSION = "0.1.0";
export const SAVE_VERSION = 1;
export const SAVE_KEY = "pharmaRush.save";

export const BALANCE = {
  STARTING_COINS: 50,
  STARTING_XP: 0,
  STARTING_REPUTATION: 50,
  REPUTATION_MIN: 0,
  REPUTATION_MAX: 100,
  XP_PER_LEVEL_BASE: 100,
  PERFECT_XP_BONUS: 0.2,
  PERFECT_COIN_BONUS: 10,
  COMBO_MAX_MULTIPLIER: 5,
  COMBO_STEP: 5,
  COMBO_TIMEOUT_MS: 30000,
  CHALLENGE_BASE_TIME_MS: 30000,
  CHALLENGE_BONUS_TIME_MS: 2000,
  CHALLENGE_MAX_TIME_MS: 60000,
  DAILY_CASES_PER_DAY: 5,
  DAILY_BONUS_XP: 100,
  DAILY_BONUS_COINS: 50,
  WEAK_SUBJECT_THRESHOLD: 0.6,
  WEAK_SUBJECT_MIN_ATTEMPTS: 5,
  LEVEL_COIN_REWARD: 50,
  MILESTONE_COIN_REWARD: 200,
  MILESTONE_LEVELS: [5, 10, 20, 30, 50, 75],
  BOSS_EVERY_N_LEVELS: 5,
  TOUCH_TARGET_MIN: 44,
};

export const DIFFICULTY = {
  easy: { choiceCount: 3, timeMs: 15000 },
  normal: { choiceCount: 4, timeMs: 12000 },
  hard: { choiceCount: 5, timeMs: 10000 },
  expert: { choiceCount: 5, timeMs: 8000 },
  boss: { choiceCount: 5, timeMs: 12000 },
};

export const REWARD_BASE = {
  easy: { xp: 50, coins: 20 },
  normal: { xp: 80, coins: 35 },
  hard: { xp: 120, coins: 55 },
  expert: { xp: 160, coins: 75 },
  boss: { xp: 200, coins: 100 },
};

export const OUTCOME_MULTIPLIER = {
  best: { xp: 1.0, coins: 1.0, rep: 3 },
  safe: { xp: 0.75, coins: 1.0, rep: 1 },
  suboptimal: { xp: 0.4, coins: 0.5, rep: -2 },
  dangerous: { xp: 0.0, coins: 0.0, rep: -10 },
};

export const LEVEL_TITLES = {
  1: "Junior Trainee",
  5: "Pharmacy Assistant",
  10: "Junior Pharmacist",
  20: "Senior Pharmacist",
  30: "Clinical Specialist",
  50: "Pharma Master",
  75: "Legendary Pharmacist",
};
