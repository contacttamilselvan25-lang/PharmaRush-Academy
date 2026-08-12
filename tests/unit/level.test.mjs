import { test } from "node:test";
import assert from "node:assert/strict";

import { titleForLevel, isMilestone, isBossLevel, levelUpRewards } from "../../src/systems/level.js";

test("titleForLevel picks the highest title at or below level", () => {
  assert.equal(titleForLevel(1), "Junior Trainee");
  assert.equal(titleForLevel(4), "Junior Trainee");
  assert.equal(titleForLevel(5), "Pharmacy Assistant");
  assert.equal(titleForLevel(10), "Junior Pharmacist");
  assert.equal(titleForLevel(20), "Senior Pharmacist");
  assert.equal(titleForLevel(50), "Pharma Master");
  assert.equal(titleForLevel(80), "Legendary Pharmacist");
});

test("isMilestone", () => {
  assert.equal(isMilestone(5), true);
  assert.equal(isMilestone(10), true);
  assert.equal(isMilestone(6), false);
});

test("isBossLevel every 5 levels", () => {
  assert.equal(isBossLevel(1), false);
  assert.equal(isBossLevel(5), true);
  assert.equal(isBossLevel(10), true);
  assert.equal(isBossLevel(11), false);
});

test("levelUpRewards", () => {
  assert.deepEqual(levelUpRewards(5), { coins: 200, milestone: true });
  assert.deepEqual(levelUpRewards(6), { coins: 50, milestone: false });
});
