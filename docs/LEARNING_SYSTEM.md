# PHARMA RUSH — Learning System

## Philosophy

Learning happens through decisions, not reading. Every case answer leads to:
RESULT → SHORT EXPLANATION → ONE FACT → CONTINUE.

Never show paragraphs. Max ~3 lines for explanations, 1 line for facts.

## Knowledge Bank

- Cards stored in `src/data/knowledge.js`, organized by subject × level.
- Subjects: Pharmacology, Pharmaceutics, Pharmaceutical Chemistry, Pharmacognosy, Pharmacy Practice.
- Levels: beginner, intermediate, advanced.
- A card unlocks when the player encounters it in a case (relatedMedicine / objectives link).
- Collecting all cards in a subject grants a mastery achievement.

## Spaced repetition

Per-card boxes:

| Box | Interval | Meaning |
|---|---|---|
| 0 | now | just learned (review at case end) |
| 1 | +1 day | seen once |
| 2 | +3 days | reviewed correctly once |
| 3 | +7 days | doing well |
| 4 | +14 days | strong |
| 5 | +30 days | mastered |

- Correct review → box+1. Wrong → box=1.
- Tracked per card: `{ box, firstSeen, lastReviewed, correct, wrong, nextReview }`.
- Only unlocked cards are scheduled. A subtle "N due for review" badge prompts review; never a nag.
- Implemented in `src/learning/spacedRepetition.js`; stored in localStorage.

## Weak-topic detection

- Per-subject accuracy tracked in `stats.perSubject`.
- If accuracy in a subject falls below a threshold (e.g. 60%) after ≥5 attempts, show:
  "Your ANS skills need practice." → offer 3 quick cases + 1 knowledge card + 1 recall challenge.
- Implemented in `src/learning/weakTopic.js`.

## Anti-guessing design

- Explanations always follow answers.
- Safety check + counselling steps make cases multi-stage.
- Combo rewards score/coins, not progress.

## GPAT / B.Pharm coverage

Subject tree (data tags, not hard-coded):

```
pharmaceutics            → physical, dosageForms, biopharm, pharmacokinetics, engineering, ndds
pharmaceuticalChemistry  → medicinal, analytical, organic, sar, nameReactions, instrumentation
pharmacology             → ans, cns, cvs, endocrine, antimicrobials, chemotherapy, adr
pharmacognosy            → alkaloids, glycosides, tannins, flavonoids, volatileOils, naturalProducts
pharmacyPractice         → prescription, dispensing, counselling, adr, interactions, safety
```

v1 fills only MVP needs; content is added gradually with no engine changes.
