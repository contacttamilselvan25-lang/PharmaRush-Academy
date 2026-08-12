import { test } from "node:test";
import assert from "node:assert/strict";

import { computeRewards, applyRewards } from "../../src/systems/rewards.js";
import { defaultState } from "../../src/core/state.js";

test("computeRewards for a perfect easy case", () => {
  assert.deepEqual(computeRewards({ difficulty: "easy", tier: "best" }), {
    tier: "best",
    xp: 60,
    coins: 30,
    rep: 3,
  });
});

test("computeRewards for a dangerous case yields no xp/coins and big rep loss", () => {
  const r = computeRewards({ difficulty: "hard", tier: "dangerous" });
  assert.equal(r.xp, 0);
  assert.equal(r.coins, 0);
  assert.equal(r.rep, -10);
});

test("applyRewards mutates state correctly", () => {
  const state = defaultState();
  applyRewards(state, { tier: "best", xp: 60, coins: 30, rep: 3 });
  assert.equal(state.player.xp, 60);
  assert.equal(state.player.coins, 80);
  assert.equal(state.player.reputation, 53);
});

test("applyRewards clamps reputation", () => {
  const state = defaultState();
  state.player.reputation = 100;
  applyRewards(state, { tier: "best", xp: 0, coins: 0, rep: 3 });
  assert.equal(state.player.reputation, 100);
});
