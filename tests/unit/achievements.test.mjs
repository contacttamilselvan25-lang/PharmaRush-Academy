import { test } from "node:test";
import assert from "node:assert/strict";
import { defaultState } from "../../src/core/state.js";
import { checkAchievements, evaluateCondition } from "../../src/systems/achievements.js";

test("evaluateCondition compares stats", () => {
  const state = defaultState();
  state.stats.patientsServed = 50;
  assert.equal(evaluateCondition(state, { stat: "patientsServed", op: ">=", value: 100 }), false);
  state.stats.patientsServed = 100;
  assert.equal(evaluateCondition(state, { stat: "patientsServed", op: ">=", value: 100 }), true);
});

test("checkAchievements unlocks and never re-unlocks", () => {
  const state = defaultState();
  state.stats.casesCompleted = 1;
  const first = checkAchievements(state);
  assert.ok(first.some((a) => a.id === "ach_first_patient"));
  const second = checkAchievements(state);
  assert.equal(second.length, 0);
});

test("level-based achievement uses xp-derived level", () => {
  const state = defaultState();
  state.player.xp = 4500;
  const newly = checkAchievements(state);
  assert.ok(newly.some((a) => a.id === "ach_level_10"));
});
