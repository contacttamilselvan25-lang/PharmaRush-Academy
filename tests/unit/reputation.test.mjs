import { test } from "node:test";
import assert from "node:assert/strict";

import { reputationDelta, applyReputation } from "../../src/systems/reputation.js";

test("reputationDelta per tier", () => {
  assert.equal(reputationDelta("best"), 3);
  assert.equal(reputationDelta("safe"), 1);
  assert.equal(reputationDelta("suboptimal"), -2);
  assert.equal(reputationDelta("dangerous"), -10);
});

test("applyReputation clamps to 0..100", () => {
  const state = { player: { reputation: 50 } };
  assert.equal(applyReputation(state, 60), 100);
  assert.equal(state.player.reputation, 100);
  assert.equal(applyReputation(state, -500), 0);
  assert.equal(state.player.reputation, 0);
});
