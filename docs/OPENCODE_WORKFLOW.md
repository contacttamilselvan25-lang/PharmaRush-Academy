# PHARMA RUSH — OpenCode Workflow

## Core rule

**Never rewrite the whole project.** For every change:
1. Inspect the existing project.
2. Understand the current architecture.
3. Identify affected files.
4. Make the smallest necessary changes.
5. Preserve working functionality.
6. Test the change.
7. Report exactly what changed.

## Standard build prompt template

> "Phase N of PHARMA RUSH per docs/ROADMAP.md. Implement [objective]. Files affected: [list]. Do not rewrite existing working code. Run `node --test` and confirm green. Report: files changed, features added, tests run, problems found, next step."

## Per-phase prompts

### Phase 1 — Skeleton
> "Phase 1 of PHARMA RUSH. Create the project skeleton per docs/ARCHITECTURE.md §Folder Structure: index.html, src/config.js, src/core/utils.js, src/core/eventBus.js, src/core/router.js (screen registry showing one blank 'Splash' screen), src/css/main.css with design tokens, src/main.js boot that logs 'PHARMA RUSH booted'. No game logic yet. Test: open index.html via a local server, confirm Splash renders and the log appears."

### Phase 2 — Core engine
> "Phase 2 of PHARMA RUSH. Add src/systems/{xp,level,coins,reputation,combo}.js as pure functions per docs/DATA_SCHEMA.md and docs/ARCHITECTURE.md §32 formulas, plus src/storage/save.js with versioned save/load/migrate. Add unit tests in tests/unit/. Run `node --test` — all green. Report files changed and test results."

### Phase 3 — Pharmacy screen
> "Phase 3 of PHARMA RUSH. Build the main Pharmacy screen (src/ui/screens/pharmacy.js) with a simple customer queue and the top stat bar (level/XP/coins/reputation). Use src/ui/dom.js and existing components. Test manually in browser."

### Phase 4 — Case flow
> "Phase 4 of PHARMA RUSH. Create src/data/medicines.js and src/data/cases.js with the 20 medicines / 30 cases seed data for MVP, and src/game/caseRunner.js plus the Case screen that walks through: case → choices → result. Run data validation and a manual full-case test."

### Phase 5 — Safety + counselling
> "Phase 5 of PHARMA RUSH. Add src/game/safety.js (allergy/interaction/contraindication checks per case.safetyChecks) and src/game/counselling.js. Apply the outcome tier matrix from docs/DATA_SCHEMA.md. Add unit tests for safety checks."

### Phase 6 — Rewards wiring
> "Phase 6 of PHARMA RUSH. Wire rewards on case completion: XP, coins, reputation deltas, perfect bonus, level-up events, toasts. Use the event bus. Test with a manual case."

### Phase 7 — Inventory + expiry
> "Phase 7 of PHARMA RUSH. Add src/systems/inventory.js and the Inventory screen: stock by medicine, quantities, expiry dates, low-stock warnings. Data-driven. Add tests."

### Phase 8 — Knowledge Bank
> "Phase 8 of PHARMA RUSH. Create src/data/knowledge.js (beginner cards for all 5 subjects), src/learning/knowledgeBank.js, and the Knowledge Bank screen. Cards unlock when their related medicine/case appears. Add data validation."

### Phase 9 — Spaced repetition
> "Phase 9 of PHARMA RUSH. Implement src/learning/spacedRepetition.js per docs/LEARNING_SYSTEM.md boxes 0–5. Add a review screen and due badge. Add unit tests for box transitions."

### Phase 10 — Upgrades + economy
> "Phase 10 of PHARMA RUSH. Add src/data/upgrades.js and the Upgrades screen. Apply costs and effects per docs/ARCHITECTURE.md §22. Add economy tests."

### Phase 11 — Achievements
> "Phase 11 of PHARMA RUSH. Add src/data/achievements.js (10 MVP achievements) and src/systems/achievements.js with unlock toasts. Add tests."

### Phase 12 — Daily challenge
> "Phase 12 of PHARMA RUSH. Add src/data/daily.js and the daily challenge (5 date-seeded cases, streak, one completion per day). Add date tests."

### Phase 13 — Boss cases
> "Phase 13 of PHARMA RUSH. Add src/game/boss.js and boss case records (every 5 levels). Add tests."

### Phase 14 — Audio
> "Phase 14 of PHARMA RUSH. Add src/audio/sound.js — WebAudio-synthesized SFX (click, correct, incorrect, reward, levelup, achievement) and mute setting."

### Phase 15–17 — Polish, optimization, full test pass
> "Phase N of PHARMA RUSH. [per ROADMAP]. Run full `node --test`, data validation, manual offline + mobile checks, content safety review. Report everything."

### Phase 18–19 — Android + release
> "Phase 18 of PHARMA RUSH. Set up Capacitor wrapping for the web app per Capacitor docs. Then Phase 19 release prep (README, icons, checklist)."

## Expected result / test / next step
Every prompt above ends with the phase's completion criteria from docs/ROADMAP.md. After each phase, ask OpenCode to report and then continue with the next phase prompt.
