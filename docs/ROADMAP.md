# PHARMA RUSH — Development Roadmap

Build order, with per-phase: objective · files · features · dependencies · tests · completion criteria · complexity · risks.

## Phase 0 — Architecture
- **Objective:** planning docs (GAME_DESIGN, ARCHITECTURE, DATA_SCHEMA, LEARNING_SYSTEM, LOW_MB_OPTIMIZATION, TESTING_PLAN, CONTENT_GUIDELINES, OPENCODE_WORKFLOW).
- **Files:** docs/*
- **Complexity:** Low · **Risk:** none (no code).

## Phase 1 — Project setup
- **Objective:** runnable skeleton.
- **Files:** index.html, src/config.js, src/core/utils.js, src/core/eventBus.js, src/core/router.js, src/core/state.js, src/css/main.css, src/main.js
- **Features:** Splash screen (blank), boot log, design tokens.
- **Dependencies:** none.
- **Tests:** open via local server, splash renders, console log shows.
- **Completion:** browser boots with zero errors.
- **Complexity:** Low.

## Phase 2 — Core engine
- **Objective:** systems layer + save shell.
- **Files:** src/systems/*.js, src/storage/save.js
- **Features:** XP, coins, reputation, level, combo math; versioned save/load/migrate.
- **Dependencies:** Phase 1.
- **Tests:** node:test unit tests for all formulas.
- **Completion:** all unit tests green.
- **Complexity:** Medium.

## Phase 3 — Pharmacy screen
- **Objective:** main hub UI + customer queue.
- **Files:** src/ui/screens/pharmacy.js, components
- **Features:** pharmacy layout, customer arrivals, stat bar.
- **Dependencies:** Phase 2.
- **Tests:** manual UI.
- **Complexity:** Medium.

## Phase 4 — Case flow
- **Objective:** the heart of the game.
- **Files:** src/data/medicines.js (start), src/data/cases.js (start), src/game/caseRunner.js, src/ui/screens/case.js
- **Features:** present case → choices → outcome.
- **Dependencies:** Phase 2, 3.
- **Tests:** full case test.
- **Complexity:** High.

## Phase 5 — Safety + counselling
- **Files:** src/game/safety.js, src/game/counselling.js
- **Features:** allergy/interaction/contraindication checks, counselling step, penalties.
- **Dependencies:** Phase 4.
- **Tests:** safety unit + manual.
- **Complexity:** Medium.

## Phase 6 — Rewards wiring
- **Features:** apply XP/coins/reputation on case end, level-ups, toasts.
- **Dependencies:** Phase 4.
- **Tests:** unit.
- **Complexity:** Low.

## Phase 7 — Inventory + expiry
- **Files:** src/systems/inventory.js, pharmacy inventory screen
- **Dependencies:** Phase 4.
- **Tests:** data validation.
- **Complexity:** Medium.

## Phase 8 — Knowledge Bank
- **Files:** src/data/knowledge.js, src/learning/knowledgeBank.js, src/ui/screens/knowledgeBank.js
- **Dependencies:** Phase 4.
- **Tests:** data validation.
- **Complexity:** Medium.

## Phase 9 — Spaced repetition
- **Files:** src/learning/spacedRepetition.js
- **Dependencies:** Phase 8.
- **Tests:** unit.
- **Complexity:** Medium.

## Phase 10 — Upgrades + economy
- **Files:** src/data/upgrades.js, src/systems/level.js (rewards), upgrade screen
- **Dependencies:** Phase 7.
- **Tests:** economy test.
- **Complexity:** Medium.

## Phase 11 — Achievements
- **Files:** src/data/achievements.js, src/systems/achievements.js
- **Dependencies:** Phase 6.
- **Tests:** unit.
- **Complexity:** Low.

## Phase 12 — Daily challenge
- **Files:** src/data/daily.js, src/modes/challengeDaily.js
- **Dependencies:** Phase 4.
- **Tests:** date unit.
- **Complexity:** Low.

## Phase 13 — Boss cases
- **Files:** src/game/boss.js, boss case records
- **Dependencies:** Phase 4, 6.
- **Tests:** case test.
- **Complexity:** Medium.

## Phase 14 — Audio
- **Files:** src/audio/sound.js
- **Features:** synthesized click/correct/incorrect/reward/levelup/achievement, mute toggle.
- **Dependencies:** none.
- **Tests:** manual.
- **Complexity:** Low.

## Phase 15 — Visual polish
- **Features:** animations, transitions, reduced-motion support.
- **Complexity:** Low.

## Phase 16 — Optimization + offline check
- **Features:** DOM audit, save on events, devtools-offline play test.
- **Complexity:** Low.

## Phase 17 — Full test pass + content safety review
- **Features:** run all suites, review every content record.
- **Complexity:** Medium.

## Phase 18 — Android packaging (Capacitor)
- **Features:** Capacitor init, build, APK.
- **Complexity:** Medium.

## Phase 19 — Release prep
- **Features:** README, app icons, final checklist.
- **Complexity:** Low.

## Version roadmap

| Version | Contents |
|---|---|
| v0.1 | Prototype: single screen, 5 medicines, 8 cases, no save |
| **v0.2** | Playable MVP (20 meds / 30 cases / full loop + save + achievements) |
| v0.3 | Learning system (knowledge bank, spaced repetition, weak-topic) |
| v0.4 | Progression (inventory, upgrades, achievements, daily, bosses) |
| v0.5 | Polish (audio, animations, accessibility, optimization) |
| v1.0 | First release + Android package |
| v1.1+ | Modes 2–5, 100 medicines, 300+ cases, GPAT packs |
