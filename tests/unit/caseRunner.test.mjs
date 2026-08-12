import { test } from "node:test";
import assert from "node:assert/strict";
import { defaultState } from "../../src/core/state.js";
import { applyCaseResult } from "../../src/game/caseRunner.js";

const fixture = {
  caseId: "fixture_1",
  difficulty: "easy",
  title: "Fixture",
  patient: { profile: "adult", age: 30, sex: "M", complaint: "x", history: "", allergies: [] },
  choices: [
    { id: "A", label: "right", tier: "best" },
    { id: "B", label: "ok", tier: "safe" },
    { id: "C", label: "bad", tier: "dangerous" },
  ],
  correct: "A",
  safetyChecks: [{ type: "interaction", detail: "d" }],
  counselling: [
    { id: "p1", label: "r", correct: true },
    { id: "p2", label: "w", correct: false },
  ],
  explanation: "e",
  objectives: ["pharmacology:Analgesics"],
  penalty: { rep: 5, coins: 5 },
  relatedMedicines: ["paracetamol_500"],
  topics: ["pharmacology"],
};

test("perfect case: best tier + correct counselling", () => {
  const state = defaultState();
  const r = applyCaseResult(state, fixture, { choiceId: "A", selectedIds: ["p1"] });
  assert.equal(r.finalTier, "best");
  assert.equal(r.rewards.xp, 60);
  assert.equal(state.stats.casesCompleted, 1);
  assert.equal(state.stats.zeroErrorStreak, 1);
  assert.equal(state.stats.interactionsCaught, 1);
  assert.ok(state.stats.perSubject.pharmacology.attempts === 1);
  assert.ok(state.stats.perSubject.pharmacology.correct === 1);
  assert.ok(state.unlocked.medicines.includes("paracetamol_500"));
});

test("dangerous choice gives zero xp and reputation loss", () => {
  const state = defaultState();
  const r = applyCaseResult(state, fixture, { choiceId: "C", selectedIds: ["p1"] });
  assert.equal(r.finalTier, "dangerous");
  assert.equal(r.rewards.xp, 0);
  assert.equal(state.player.reputation, 40);
  assert.equal(state.stats.zeroErrorStreak, 0);
});

test("wrong counselling downgrades a best decision to safe", () => {
  const state = defaultState();
  const r = applyCaseResult(state, fixture, { choiceId: "A", selectedIds: ["p2"] });
  assert.equal(r.finalTier, "safe");
  assert.equal(r.rewards.xp, 38);
});

test("first completed case unlocks the First Patient achievement", () => {
  const state = defaultState();
  const r = applyCaseResult(state, fixture, { choiceId: "A", selectedIds: ["p1"] });
  assert.ok(r.achievements.some((a) => a.id === "ach_first_patient"));
  assert.ok(state.achievements.includes("ach_first_patient"));
});
