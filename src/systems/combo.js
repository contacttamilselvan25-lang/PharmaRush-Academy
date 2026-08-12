import { BALANCE } from "../config.js";

export function comboMultiplier(combo) {
  return Math.min(
    BALANCE.COMBO_MAX_MULTIPLIER,
    1 + Math.floor(combo / BALANCE.COMBO_STEP)
  );
}

export function onCorrect(combo) {
  return combo + 1;
}

export function onWrong() {
  return 0;
}

export function comboBonusCoins(combo) {
  return comboMultiplier(combo);
}
