import { DIFFICULTY } from "../config.js";

export function difficultyConfig(difficulty) {
  return DIFFICULTY[difficulty] ?? DIFFICULTY.easy;
}

export function timeLimitMs(difficulty) {
  return difficultyConfig(difficulty).timeMs;
}

export function choiceCount(difficulty) {
  return difficultyConfig(difficulty).choiceCount;
}
