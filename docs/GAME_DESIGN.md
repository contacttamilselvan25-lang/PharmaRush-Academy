# PHARMA RUSH — Game Design Document

## Vision

**Play. Practice. Learn. Become the Best Pharmacist.**

A lightweight 2D pharmacy simulation + educational game. The player runs a pharmacy, serves customers, makes pharmacy decisions, learns one fact per case, and grows from Junior Trainee to Pharma Master.

## Design pillars

1. **Game first, study tool second.** Never a quiz interface. Every case is a story with a decision.
2. **Learning through decisions.** The player learns because they answered, not because they read.
3. **One fact at a time.** Short explanations, 1-line facts, tooltips. Never paragraphs.
4. **Offline, tiny, friendly.** Runs on low-end Android with no internet and under 1 MB core.

## Core loop

```
CUSTOMER ARRIVES → UNDERSTAND CASE → PHARMACY DECISION → SAFETY CHECK
        → COUNSEL PATIENT → CASE RESULT → REWARD → KNOWLEDGE UNLOCK
        → UPGRADE → NEXT CUSTOMER
```

## Game modes

1. **Pharmacy Simulator** (main) — queue, inventory, expiry, reputation, money, XP, counselling, safety.
2. **30-Second Challenge** — fast cases; +2s per correct; combo multiplier ×1→×5 (every 5 streak).
3. **Drug Match** — match drug→class→mechanism→indication→ADR against the clock.
4. **Lab Mini-Games** — pH, titration, dissolution, formulation. Simple + educational.
5. **Clinical Boss Case** — every 5 levels, a hard multi-med elderly case.

## Player progression

- **Levels 1–75+** with titles: Junior Trainee → Pharmacy Assistant → Junior Pharmacist → Senior Pharmacist → Clinical Specialist → Pharma Master → Legendary Pharmacist.
- **XP:** level *l*→*l*+1 costs `100 × l`. No grind.
- **Coins:** earned per case, spent on upgrades and hints. No real-money purchases.
- **Reputation 0–100:** good service up, mistakes down; ≥75 unlocks advanced patients.

## Player retention (ethical)

Progression, mastery, achievements, daily challenges, new cases, pharmacy upgrades, knowledge collection.

**Explicitly avoided:** gambling mechanics, loot boxes, manipulative purchases, nagging notifications, pay-to-win, artificial energy systems.

## Non-goals

- Not a diagnosis/prescribing tool.
- Not clinical decision support.
- No online features in v1.
