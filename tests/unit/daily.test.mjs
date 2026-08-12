import { test } from "node:test";
import assert from "node:assert/strict";
import { defaultState } from "../../src/core/state.js";
import { buildDaily, completeDaily, DAILY_CASE_COUNT } from "../../src/modes/daily.js";

test("buildDaily seeds 5 distinct cases for today", () => {
  const state = defaultState();
  const daily = buildDaily(state);
  assert.equal(daily.caseIds.length, DAILY_CASE_COUNT);
  assert.equal(new Set(daily.caseIds).size, DAILY_CASE_COUNT);
});

test("buildDaily is idempotent within the same day", () => {
  const state = defaultState();
  const d1 = buildDaily(state);
  const d2 = buildDaily(state);
  assert.deepEqual(d1.caseIds, d2.caseIds);
});

test("completeDaily awards bonus and starts a streak", () => {
  const state = defaultState();
  buildDaily(state);
  state.daily.index = state.daily.caseIds.length;
  const bonus = completeDaily(state);
  assert.ok(bonus.xp > 0 && bonus.coins > 0);
  assert.equal(state.daily.completed, true);
  assert.equal(state.player.streak, 1);
  assert.ok(state.player.lastDaily);
});

test("completing daily twice in one day does not double the streak", () => {
  const state = defaultState();
  buildDaily(state);
  state.daily.index = state.daily.caseIds.length;
  completeDaily(state);
  const first = state.player.streak;
  completeDaily(state);
  assert.equal(state.player.streak, first);
});
