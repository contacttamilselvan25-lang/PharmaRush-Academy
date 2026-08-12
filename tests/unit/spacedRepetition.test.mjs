import { test } from "node:test";
import assert from "node:assert/strict";
import { defaultState } from "../../src/core/state.js";
import { touch, recordReview, dueCards, isMastered, masteredCount, INTERVALS_DAYS } from "../../src/learning/spacedRepetition.js";

test("INTERVALS increase from 0 to 30 days", () => {
  assert.deepEqual(INTERVALS_DAYS, [0, 1, 3, 7, 14, 30]);
});

test("touch schedules a card for immediate review in box 0", () => {
  const state = defaultState();
  touch(state, "k1");
  assert.equal(state.knowledge.reviewBoxes.k1.box, 0);
  assert.ok(dueCards(state, ["k1"]).includes("k1"));
});

test("correct reviews move up boxes; wrong drops to box 1", () => {
  const state = defaultState();
  touch(state, "k1");
  recordReview(state, "k1", true);
  assert.equal(state.knowledge.reviewBoxes.k1.box, 1);
  recordReview(state, "k1", true);
  assert.equal(state.knowledge.reviewBoxes.k1.box, 2);
  recordReview(state, "k1", false);
  assert.equal(state.knowledge.reviewBoxes.k1.box, 1);
});

test("mastery at box 5 and masteredCount", () => {
  const state = defaultState();
  touch(state, "k1");
  for (let i = 0; i < 5; i++) recordReview(state, "k1", true);
  assert.equal(isMastered(state, "k1"), true);
  assert.equal(masteredCount(state), 1);
});
