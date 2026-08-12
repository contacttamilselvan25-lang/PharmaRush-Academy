# PHARMA RUSH — Testing Plan

Tests run with Node's built-in `node --test` — zero dependencies. Data validation is a separate script.

## Categories

### 1. Unit tests (`tests/unit/`) — pure math
- `xp.test.mjs` — xpForLevel, cumulative XP.
- `level.test.mjs` — level from XP, milestone titles/rewards.
- `coins.test.mjs` — case coin rewards, perfect bonus.
- `combo.test.mjs` — multiplier at 5/10/15/20 streaks, reset on wrong.
- `reputation.test.mjs` — clamp 0–100, deltas.
- `spacedRepetition.test.mjs` — box transitions, next review dates.
- `difficulty.test.mjs` — choice count, time limit per difficulty.

### 2. Data validation (`tests/data/validate.mjs`)
- Every medicine/case/card/achievement/upgrade record: required fields present, types correct.
- Cross-references resolve (case → medicine, knowledge → medicine).
- Every record has a complete `source` block (reviewed, reviewer, lastReviewed).
- No duplicate ids.

### 3. Save/load
- Round-trip: save → load returns identical state.
- Migration from old version; corrupt/unknown-version handling (backup + fresh start).

### 4. Progression (manual checklist)
- Level-up toast + milestone rewards.
- Boss unlock every 5 levels.
- Upgrade level gates respected.

### 5. UI (manual checklist)
- Every screen reachable from the menu and back.
- Buttons respond; no dead ends; no console errors.

### 6. Offline
- DevTools → Network → Offline; full play session with no errors.

### 7. Mobile
- Responsive sizes; touch targets ≥44px; settings toggle works.

### 8. Content safety
- Content review per CONTENT_GUIDELINES.md; disclaimer present; no unsafe instructions.

## Commands

```
node --test          # run all unit tests
node tests/data/validate.mjs   # validate content data
```

## Checklist per phase
Each phase is complete only when its listed tests pass AND a quick manual smoke test in the browser succeeds.
