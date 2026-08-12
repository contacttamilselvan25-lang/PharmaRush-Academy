import { test } from "node:test";
import assert from "node:assert/strict";

import { comboMultiplier, onCorrect, onWrong } from "../../src/systems/combo.js";

test("comboMultiplier grows every 5 streak, capped at 5", () => {
  assert.equal(comboMultiplier(0), 1);
  assert.equal(comboMultiplier(4), 1);
  assert.equal(comboMultiplier(5), 2);
  assert.equal(comboMultiplier(9), 2);
  assert.equal(comboMultiplier(10), 3);
  assert.equal(comboMultiplier(15), 4);
  assert.equal(comboMultiplier(20), 5);
  assert.equal(comboMultiplier(25), 5);
});

test("onCorrect increments; onWrong resets", () => {
  assert.equal(onCorrect(3), 4);
  assert.equal(onCorrect(19), 20);
  assert.equal(onWrong(), 0);
});
