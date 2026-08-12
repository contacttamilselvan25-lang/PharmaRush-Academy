import { test } from "node:test";
import assert from "node:assert/strict";

import {
  xpForLevel,
  xpToReachLevel,
  levelForXp,
  xpIntoLevel,
  xpNeededForNextLevel,
  xpForCase,
} from "../../src/systems/xp.js";

test("xpForLevel costs 100 x level", () => {
  assert.equal(xpForLevel(1), 100);
  assert.equal(xpForLevel(2), 200);
  assert.equal(xpForLevel(10), 1000);
});

test("xpToReachLevel cumulative math", () => {
  assert.equal(xpToReachLevel(1), 0);
  assert.equal(xpToReachLevel(2), 100);
  assert.equal(xpToReachLevel(5), 1000);
  assert.equal(xpToReachLevel(10), 4500);
});

test("levelForXp maps xp to levels", () => {
  assert.equal(levelForXp(0), 1);
  assert.equal(levelForXp(99), 1);
  assert.equal(levelForXp(100), 2);
  assert.equal(levelForXp(999), 4);
  assert.equal(levelForXp(1000), 5);
  assert.equal(levelForXp(4500), 10);
});

test("xpIntoLevel gives progress within current level", () => {
  assert.equal(xpIntoLevel(0), 0);
  assert.equal(xpIntoLevel(100), 0);
  assert.equal(xpIntoLevel(150), 50);
});

test("xpNeededForNextLevel", () => {
  assert.equal(xpNeededForNextLevel(0), 100);
  assert.equal(xpNeededForNextLevel(100), 200);
});

test("xpForCase follows tier and perfect bonus", () => {
  assert.equal(xpForCase({ difficulty: "easy", tier: "best" }), 60);
  assert.equal(xpForCase({ difficulty: "easy", tier: "safe" }), 38);
  assert.equal(xpForCase({ difficulty: "normal", tier: "safe" }), 60);
  assert.equal(xpForCase({ difficulty: "hard", tier: "suboptimal" }), 48);
  assert.equal(xpForCase({ difficulty: "boss", tier: "dangerous" }), 0);
});
