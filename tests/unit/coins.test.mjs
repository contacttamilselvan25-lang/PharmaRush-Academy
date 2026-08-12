import { test } from "node:test";
import assert from "node:assert/strict";

import { baseCoins, coinsForCase, addCoins, spendCoins } from "../../src/systems/coins.js";

test("baseCoins per difficulty", () => {
  assert.equal(baseCoins("easy"), 20);
  assert.equal(baseCoins("normal"), 35);
  assert.equal(baseCoins("hard"), 55);
  assert.equal(baseCoins("boss"), 100);
});

test("coinsForCase tier and perfect bonus", () => {
  assert.equal(coinsForCase({ difficulty: "easy", tier: "best" }), 30);
  assert.equal(coinsForCase({ difficulty: "normal", tier: "safe" }), 35);
  assert.equal(coinsForCase({ difficulty: "hard", tier: "dangerous" }), 0);
});

test("coinsForCase applies combo multiplier", () => {
  assert.equal(coinsForCase({ difficulty: "normal", tier: "best", comboMult: 3 }), 115);
  assert.equal(coinsForCase({ difficulty: "easy", tier: "best", comboMult: 5 }), 110);
});

test("addCoins and spendCoins", () => {
  const state = { player: { coins: 100 } };
  assert.equal(addCoins(state, 50), 150);
  assert.equal(spendCoins(state, 30), true);
  assert.equal(state.player.coins, 120);
  assert.equal(spendCoins(state, 500), false);
  assert.equal(state.player.coins, 120);
});
