import { test } from "node:test";
import assert from "node:assert/strict";
import { counsellingResult } from "../../src/game/counselling.js";
import { tierOfChoice, downgradeTier } from "../../src/game/safety.js";

const caseRecord = {
  choices: [
    { id: "A", label: "x", tier: "best" },
    { id: "B", label: "y", tier: "safe" },
    { id: "C", label: "z", tier: "dangerous" },
  ],
  counselling: [
    { id: "p1", label: "right", correct: true },
    { id: "p2", label: "right2", correct: true },
    { id: "p3", label: "wrong", correct: false },
  ],
};

test("tierOfChoice returns the tier of the chosen option", () => {
  assert.equal(tierOfChoice(caseRecord, "A"), "best");
  assert.equal(tierOfChoice(caseRecord, "C"), "dangerous");
  assert.equal(tierOfChoice(caseRecord, "Z"), "suboptimal");
});

test("downgradeTier steps down, dangerous stays", () => {
  assert.equal(downgradeTier("best"), "safe");
  assert.equal(downgradeTier("safe"), "suboptimal");
  assert.equal(downgradeTier("suboptimal"), "dangerous");
  assert.equal(downgradeTier("dangerous"), "dangerous");
});

test("counsellingResult ok when all correct and no wrong selected", () => {
  const r = counsellingResult(caseRecord, ["p1", "p2"]);
  assert.equal(r.ok, true);
  assert.equal(r.correctSelected, 2);
});

test("counsellingResult fails on wrong selection", () => {
  const r = counsellingResult(caseRecord, ["p1", "p3"]);
  assert.equal(r.ok, false);
  assert.equal(r.wrongSelected.length, 1);
});

test("counsellingResult fails when a correct point is missed", () => {
  const r = counsellingResult(caseRecord, ["p1"]);
  assert.equal(r.ok, false);
});
