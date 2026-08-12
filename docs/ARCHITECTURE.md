# PHARMA RUSH — MASTER ARCHITECTURE BLUEPRINT

Locked decisions: **Vanilla HTML/CSS/JS** · **English content** · **Capacitor for Android (later)**.

---

## 1. Executive Summary

PHARMA RUSH is a lightweight, offline-first 2D pharmacy simulation + learning game. The player runs a pharmacy, serves customers with pharmacy cases, makes medicine and safety decisions, and learns pharmacy by playing — not by reading. The game is built with **zero frameworks**: HTML, CSS, and vanilla JavaScript ES modules. All content (medicines, cases, knowledge cards) is data-driven, so you can add 20 medicines today and 1,000 later without touching the game engine. Everything — game, saves, learning progress — lives on-device. Target total core size **under 1 MB of code + data** (far below the 10 MB budget). Android packaging via Capacitor happens at the end, not at the start.

---

## 2. Game Vision

**Play. Practice. Learn. Become the Best Pharmacist.** The player grows from a junior trainee with one counter and one shelf to a clinical specialist running a busy pharmacy. Every customer is a mini pharmacy case: understand the situation → choose the right medicine/action → pass the safety check → counsel the patient → get a result → earn XP, coins, reputation → learn one fact → continue.

The game must feel like a **game first, study tool second**. Learning is baked into the reward loop, never a wall of text.

---

## 3. Target Players

- **Primary:** B.Pharm / D.Pharm / PharmD students and new pharmacists practicing for exams (GPAT) or building clinical instincts.
- **Secondary:** Anyone curious about pharmacy, playing on low-end Android or a Windows browser.
- **Non-goal:** Healthcare professionals looking for clinical decision support. The game is an educational simulation only.

---

## 4. Core Gameplay Loop

```
CUSTOMER ARRIVES → UNDERSTAND CASE → PHARMACY DECISION → SAFETY CHECK
        → COUNSEL PATIENT → CASE RESULT → REWARD → KNOWLEDGE UNLOCK
        → UPGRADE → NEXT CUSTOMER
```

| Step | What the player sees | What the player does |
|---|---|---|
| Customer arrives | Animated customer + short dialogue bubble ("My feet have been swollen for 2 weeks") | Reads the complaint, age, history |
| Understand case | Patient profile card: age, sex, symptoms, current medicines | Decides what the pharmacy issue is |
| Pharmacy decision | 3–5 choice buttons (dispense X, recommend Y, refer) | Picks the best action |
| Safety check | Allergy / interaction / contraindication prompt | Confirms the choice is safe, or catches a hazard |
| Counsel patient | 2–3 counselling points to select/deliver | Chooses correct counselling advice |
| Case result | Outcome screen: correct/partial/wrong + 2–3 line explanation | Reads the short explanation |
| Reward | XP, coins, reputation, combo — animated | None (feels rewarding) |
| Knowledge unlock | One knowledge card appears ("Amlodipine → edema is a common ADR") | Optionally opens the card |
| Upgrade | Pharmacy grows every few levels | Spends coins on upgrades |
| Next customer | New customer walks in (difficulty scales with level) | Loops |

**Difficulty increases by:** more medicines in play, more distracter choices, interactions/contraindications to catch, elderly/pediatric considerations, time pressure in some modes, and boss cases every 5 levels.

**Education is introduced** in 1-line facts after each answer — never paragraphs.

---

## 5. Game Modes

| Mode | Purpose | Core mechanic |
|---|---|---|
| **1. Pharmacy Simulator** | Main game | Queue, inventory, expiry, money, reputation, upgrades |
| **2. 30-Second Challenge** | Fast recall + combos | 30s timer, +2s per correct answer, combo multiplier |
| **3. Drug Match** | Association mastery | Match drug→class→mechanism→indication→ADR in a timed grid |
| **4. Lab Mini-Games** | Pharmaceutics practice | Tiny games: pH scale, titration drops, dissolution, formulation puzzle |
| **5. Clinical Boss Case** | Every 5 levels | Complex multi-med elderly case; must find the pharmacy issue |

**Mode 2 scoring (exact):**
- Correct answer: `score += 10 × multiplier`
- Combo: starts at 0. Each correct `combo++`. Multiplier = `1 + floor(combo/5)`, capped at ×5 (so 5→×2, 10→×3, 15→×4, 20→×5).
- Wrong answer: combo resets to 0. No score.
- Timer: starts 30s; each correct answer `+2s` (cap 60s). Question time ~8–12s per case depending on difficulty. Game ends at 0s.
- **Anti-guessing:** wrong answers do not subtract score, but they break the combo and show the correct answer + fact before the next question.

**Mode 3 scoring:** points for each correct match in a 60s round; combo same as mode 2. Grid shrinks/gets harder as the player levels.

---

## 6. Educational System

Three layers, all data-driven and stored separately from game logic:

1. **Knowledge Cards** (`src/data/knowledge.js`) — the "PHARMA KNOWLEDGE BANK", organized by 5 subjects (Pharmacology, Pharmaceutics, Pharmaceutical Chemistry, Pharmacognosy, Pharmacy Practice), each with beginner/intermediate/advanced levels.
2. **In-flow facts** — every case/answer outcome surfaces one short fact card (1–2 lines).
3. **Spaced repetition reviews** — surfaces mastered cards at increasing intervals.

Subjects map to GPAT/B.Pharm topics (see §18). Content records carry a validation block (source, reviewer, status) — hidden from normal players, visible to you as developer.

---

## 7. Pharmacy Simulation

- **Start:** 1 counter, 1 shelf, ~20 inventory slots, small customer area.
- **Progression:** unlock more shelves → more inventory capacity; counselling area → higher satisfaction; storage → fewer expired meds; assistant → auto-restock; equipment → unlocks lab mini-games.
- **Gameplay-affecting upgrades** (never purely cosmetic):
  - Inventory System → shows low-stock/expiry warnings (fewer stock-outs)
  - Counselling Area → +satisfaction bonus on counselling step
  - Storage Upgrade → slower expiry rate
  - Assistant → auto-fills restock, small time bonus
  - Decor → cosmetic only (cheap, optional)
- Expiry: medicines have expiry timers; selling near-expiry items lowers reputation; allowing expiry loses coins.

---

## 8. Medicine System

Data-driven records in `src/data/medicines.js`. **No medicine-specific logic ever lives in the engine** — every check reads the medicine record's fields. Fields per §9. ~20 medicines for MVP across the 5 subjects; adding 1,000 later is purely data entry + a data-validation test.

---

## 9. Patient System

Patient profiles are data templates: `adult`, `elderly`, `pediatric`, `chronic`, `allergy`, `polypharmacy`, `OTC` question, `counselling` request. A case pulls a profile and overlays symptoms/context. The game always emphasises: identify pharmacy issue, medicine safety, counselling, and **referral when appropriate** — never diagnosis or prescribing.

---

## 10. Case System

`src/data/cases.js` — fully data-driven records (caseId, difficulty, patient, symptoms, choices, correct answer, safety checks, explanation, objectives, rewards, penalties). A **caseRunner** (`src/game/caseRunner.js`) executes any case; new cases are data only. Each case has a `best`, `safe`, and `dangerous` outcome tier to power safety penalties and the anti-guessing design.

---

## 11. Safety System

Built into every case flow, not optional:
- Allergy check → wrong with known allergy = case failure + big reputation loss
- Interaction check → wrong = safety warning + penalties
- Contraindication check → wrong = case failure
- Age/dosage-form consideration → wrong = penalty, explanation
- Referral step → in some cases the best answer is "refer to doctor/emergency"

**Consequences matrix:**

| Choice tier | XP | Coins | Reputation | Result screen |
|---|---|---|---|---|
| Best (perfect) | 100% + bonus | full + bonus | +3 | Green "Perfect" |
| Safe but not best | 75% | full | +1 | Yellow "Safe" |
| Suboptimal | 40% | half | −2 | Orange |
| Dangerous | 0% | −penalty | −10 | Red safety warning |

**Never** rewards unsafe real-world behaviour. Educational text always separates counselling, prescription requirements, and referral.

---

## 12. XP System

- Sources: correct selection, correct counselling, catching interaction, catching contraindication, case completion, perfect bonus (+20%), streaks, daily challenge, boss, knowledge reviews.
- **Formula:** level *l* → *l*+1 costs `100 × l` XP.
- Cumulative XP table and rewards in §32.

---

## 13. Coin Economy

- Earned from cases (base `10 + difficulty×5`, +perfect bonus `10`, +combo bonus).
- Spent on upgrades (`cost = 50 × tier²`), hints (see §33), cosmetics.
- **No real-money purchases, ever, in v1.** Fully free and offline.
- Designed so a normal player can afford their first upgrade around level 3–4.

---

## 14. Reputation

- Range **0–100**, starts at 50.
- +1 to +5 per good service, +3 perfect; −2 to −15 for mistakes/dangerous choices; +10 boss wins.
- ≥75 unlocks advanced patients & better rewards; <25 triggers a recovery tutorial prompt.
- **Anti-exploit:** penalties are real, perfect bonuses require a fully correct multi-step case, and reputation gains never exceed the defined per-action caps.

---

## 15. Combo System

- Correct → `combo++`; wrong → reset to 0.
- Multiplier = `1 + floor(combo/5)`, **max ×5** (at 20 streak).
- Time window: combo only persists within the current case or 30s in challenge mode — no infinite carryover.
- Reward: `coins = base × multiplier`; a bar + sound + particle ping give visual/sound feedback.
- **Anti-guessing:** the reward is score/coins only, not progress; correct explanations always follow.

---

## 16. Knowledge Bank

The **PHARMA KNOWLEDGE BANK** screen. Every card: one concept, class, 1-line use, key ADR/interaction, and a 2-sentence explanation. Browseable by subject and by level (beginner/intermediate/advanced). Cards are unlocked when the player encounters them in cases. Collecting all cards in a subject grants a subject mastery achievement.

---

## 17. Spaced Repetition (Lightweight)

Per-concept review **boxes**:

| Box | Interval | Meaning |
|---|---|---|
| 0 | just learned | review immediately at case end |
| 1 | +1 day | seen once |
| 2 | +3 days | reviewed once correctly |
| 3 | +7 days | doing well |
| 4 | +14 days | strong |
| 5 | +30 days | **mastered** (shows in "Knowledge Mastered") |

- Correct review → move up one box. Wrong → drop to box 1.
- Stored per concept ID: first seen, last reviewed, correct/wrong attempts, box, next review date.
- Implemented in `src/learning/spacedRepetition.js`, saved in localStorage. No server.
- Only concepts already unlocked get scheduled; the player controls *when* to review (a gentle "2 due for review" badge, never a nag).

---

## 18. GPAT / B.Pharm Expansion

Subject tree drives data organization (not hard-coded):

```
pharmaceutics        → physical, dosage forms, biopharm, pharmacokinetics, engineering, NDDS
pharmaceuticalChemistry → medicinal, analytical, organic, SAR, name reactions, instrumentation
pharmacology         → ANS, CNS, CVS, endocrine, antimicrobials, chemotherapy, ADRs
pharmacognosy        → alkaloids, glycosides, tannins, flavonoids, volatile oils, natural products
pharmacyPractice     → prescription, dispensing, counselling, ADR, interactions, safety
```

Data uses `subject:topic` tags (e.g., `pharmacology:Cvs`). v1 fills only what MVP needs; the architecture supports gradual content expansion with zero engine changes.

---

## 19. Level System

| Level | Title |
|---|---|
| 1 | Junior Trainee |
| 5 | Pharmacy Assistant |
| 10 | Junior Pharmacist |
| 20 | Senior Pharmacist |
| 30 | Clinical Specialist |
| 50 | Pharma Master |
| 75+ | Legendary Pharmacist |

Progression math and rewards in §32. XP requirements are designed to avoid grind (§32 table shows the first 10 levels are easily reachable in ~1–2 sessions each).

---

## 20. Achievement System

Data-driven list (id, name, description, stat-condition, reward). Trigger conditions reference player stats — e.g. `patientsServed >= 100`, `interactionsCaught >= 10`, `zeroErrorStreak >= 5`. MVP ships ~10 achievements including: First Patient, First Perfect Case, 100/500 Patients, Interaction Hunter, ADR Detective, Zero-Error Streak, Clinical Boss Defeated. Toast + sound + XP/coin reward on unlock. Fully extensible by adding records.

---

## 21. Daily Challenge

- 5 curated cases/day (picked by date-seeded RNG from the case pool so it changes daily without a server).
- Reward: XP + coins + streak counter.
- **Streak:** Day 1, Day 2…; broken if a day is missed.
- **Date guard (simple):** store `lastDailyDate` (local date string) + `lastDailyStreak`. Only one completion per stored day. Date-editing protection is deliberately minimal (local files can always be edited) — no over-engineering.

---

## 22. Pharmacy Upgrade System

| Upgrade | Max tier | Effect (gameplay, not cosmetic) | Cost |
|---|---|---|---|
| Inventory System | 5 | Stock/expiry warnings, fewer stock-outs | 50·t² |
| Counselling Area | 3 | +satisfaction on counselling | 60·t² |
| Storage | 3 | Slower expiry | 60·t² |
| Shelves | 5 | +inventory slots (medicine variety) | 100·n² |
| Assistant | 3 | Auto-restock low priority | 150·t² |
| Equipment | 3 | Unlocks lab mini-games | 100·t² |
| Decor | 3 | Cosmetic only | 20·t² |

Some upgrades have level requirements (e.g., Assistant requires level 10) to pace progression.

---

## 23. UI/UX Architecture

14 screens (Splash, Main Menu, Pharmacy, Customer Case, Medicine Selection, Counselling, Result, Knowledge Bank, Inventory, Upgrades, Achievements, Profile, Settings, Daily Challenge). Built with:

- A **screen router** (`src/core/router.js`) — one container div, screens shown/hidden via CSS classes.
- **Reusable components** (`src/ui/components/`): Button, Card, Modal, Toast, StatBadge, ProgressBar — built as small DOM-helper functions, no library.
- Consistent design tokens (CSS variables for color/spacing) in `src/css/main.css`.
- Mobile-first: single column, large touch targets (≥44px), thumb-friendly.

---

## 24. Visual Style

- Clean, friendly, professional, pharmacy-themed, modern flat 2D.
- **All icons are inline SVG**; characters are simple CSS/SVG shapes (circle head, rounded body) — no image files.
- **Zero background images.** Colors + CSS gradients do the work.
- Central palette (CSS variables): pharmacy teal/green primary, warm neutral background, red for safety warnings, gold for coins/rewards.
- This system lets you swap/recolour the whole theme by editing a handful of CSS variables.

---

## 25. Audio Strategy

- **Primary: procedurally synthesized sounds** via the Web Audio API — click, correct, incorrect, reward, level-up, achievement. **Zero audio files, ~0 KB.**
- Optional tiny compressed MP3/Ogg loops only if background music is wanted in a later version.
- Global Sound ON/OFF in Settings (also an Accessibility option). Audio module is the only place `AudioContext` is touched.

---

## 26. Offline Architecture

- **No internet, account, server, API, or cloud of any kind.** All files ship with the app.
- Static content (medicines, cases, knowledge, achievements) → bundled JS data files, loaded into memory at boot.
- Player save + progress + reviews + settings → **localStorage** (≤ ~50 KB of JSON; localStorage's ~5 MB limit is a non-issue).
- `src/storage/save.js` is the **only** module that touches storage, and it exposes `load/save/export/import/reset` behind a thin interface so we could swap to IndexedDB later if the dataset ever explodes.

---

## 27. Save System

Saved JSON includes: `version`, player (level, xp, coins, reputation, streak), inventory (medicine id, qty, expiry dates), upgrades, unlocked medicines/cases, achievements, knowledge mastery + review schedule, stats, settings.

- **Auto-save** after every case result, upgrade, and achievement unlock.
- **Export/Import** as a small JSON file string (Settings screen).
- **Reset progress** (with double-confirm).
- **Save versioning:** `SAVE_VERSION` in `src/config.js`. On load, `migrate(save)` upgrades old saves version-by-version; unknown/newer version → backup the old save and start fresh rather than corrupting.

---

## 28. Technical Stack Decision

**Recommendation: HTML + CSS + Vanilla JavaScript (ES Modules).** Rationale against alternatives:

| Option | Size | Offline | Simplicity | Verdict |
|---|---|---|---|---|
| **Vanilla JS + ES modules** | ~0 KB | Native | High | **Chosen** |
| Phaser (2D engine) | ~2 MB+ | Yes | Medium | Overkill — this is a menu/case game, not a canvas-heavy action game |
| React/Vue + build tooling | 100s KB + build chain | Yes | Low | Violates the "no complexity" and non-programmer goals |
| Godot/Unity | 10s–100s MB | Yes | Low | Completely against low-MB mandate |

- **Why ES modules:** clean imports, good for incremental work. Run locally with a simple server (one command, see Phase 1).
- **No build step, no npm runtime deps.** The only dev-time tool is Node for running tests (built-in `node:test` — no test framework installed).
- **Android later:** Capacitor wraps the exact same files in a WebView. No code rewrite needed.

---

## 29. Folder Structure

```
pharma-rush/
├── index.html                 # boot screen, loads main.js
├── src/
│   ├── main.js                # bootstrap: load content → load save → start router
│   ├── config.js              # ALL magic numbers (game balance, SAVE_VERSION)
│   ├── core/
│   │   ├── eventBus.js        # tiny pub/sub for events (caseCompleted, levelUp…)
│   │   ├── router.js          # screen show/hide manager
│   │   ├── state.js           # runtime player state object
│   │   └── utils.js           # math, id gen, formatting, seeded RNG
│   ├── data/                  # CONTENT ONLY — no logic
│   │   ├── medicines.js
│   │   ├── cases.js
│   │   ├── patientProfiles.js
│   │   ├── knowledge.js
│   │   ├── achievements.js
│   │   ├── upgrades.js
│   │   └── daily.js
│   ├── systems/               # pure calculations (unit-testable, no DOM)
│   │   ├── xp.js  ├── coins.js  ├── reputation.js
│   │   ├── level.js  ├── combo.js  ├── rewards.js
│   │   ├── inventory.js  ├── achievements.js  └── difficulty.js
│   ├── game/
│   │   ├── caseRunner.js      # orchestrates a full case (the heart of the game)
│   │   ├── safety.js          # allergy/interaction/contraindication checks
│   │   ├── counselling.js
│   │   └── boss.js
│   ├── modes/
│   │   ├── challenge30.js  ├── drugMatch.js  └── lab.js
│   ├── learning/
│   │   ├── knowledgeBank.js  ├── spacedRepetition.js  └── weakTopic.js
│   ├── ui/
│   │   ├── dom.js             # createEl() helper
│   │   ├── components/        # button.js card.js toast.js modal.js progress.js
│   │   └── screens/           # one module per screen (menu, pharmacy, case…)
│   ├── storage/save.js
│   ├── audio/sound.js         # WebAudio synthesized SFX
│   └── css/main.css           # all styles (design tokens in :root)
├── assets/                    # empty in v1 (icons are inline SVG)
├── tests/
│   ├── run-tests.mjs          # node:test runner
│   ├── unit/                  # xp, combo, coins, reputation, level, spaced-rep
│   └── data/                  # validate medicines/cases/achievements records
├── docs/                      # planning docs (GAME_DESIGN, ARCHITECTURE, …)
└── README.md                  # how to run + add content
```

**Folder responsibilities:** `data/` = content only; `systems/` = pure math, no DOM, unit-testable; `game/` = case orchestration logic; `ui/` = everything visible; `core/` = plumbing; `learning/`, `storage/`, `audio/` = their domains. The engine never contains medicine-specific conditions.

---

## 30. Code Architecture (Separation of Concerns)

```
DATA (content)  ←─ systems read data, never contain it
GAME LOGIC      ←─ caseRunner + systems + safety   (no DOM)
UI              ←─ screens + components            (reads events, calls systems)
SAVE            ←─ save.js only                    (versioned, swappable)
EDUCATION       ←─ learning/ modules
AUDIO           ←─ sound.js only
CONFIG          ←─ config.js only
```

- **Event bus** (`core/eventBus.js`): systems emit events (`caseCompleted`, `levelUp`, `achievementUnlocked`); UI listens and re-renders. This keeps logic and UI decoupled.
- **Rule:** systems must not call `document.*`. Screens must not compute rewards. Data files must not contain functions that mutate state. This is the single rule that keeps the codebase maintainable.

---

## 31. Data Schemas (sample records)

**Medicine** (`data/medicines.js`):
```js
{ id: "amlo_5", genericName: "Amlodipine", brands: ["Norvasc", "Amlogard"],
  drugClass: "Calcium Channel Blocker", category: "Antihypertensive",
  mechanism: "Blocks L-type Ca channels in vascular smooth muscle",
  indications: ["Hypertension", "Chronic stable angina"],
  dosageForm: "Tablet", route: "Oral", strengths: ["2.5","5","10"],
  contraindications: ["Hypersensitivity","Severe hypotension"],
  interactions: ["CYP3A4 inhibitors","Simvastatin >20mg"],
  adrs: { common: ["Peripheral edema","Headache","Flushing"], serious: [] },
  warnings: ["Avoid in acute MI"],
  counsellingPoints: ["Take once daily, same time","Avoid grapefruit juice"],
  storage: "RT, away from light", difficulty: 1,
  subjects: ["pharmacology:Cvs"], expiryDays: 365, cost: 25,
  learningFacts: ["First-line antihypertensive in most adults"],
  source: { reference: "BNF 2025", reviewed: true, reviewer: "Dr X", lastReviewed: "2026-01-01" } }
```

**Patient** (`data/patientProfiles.js`): `{ id:"elderly", name:"Elderly", minAge:65, flags:["polypharmacy","reduced clearance"], traits:["slower metabolism"] }`

**Case** (`data/cases.js`):
```js
{ caseId:"c010", difficulty:"normal", title:"Swollen Feet",
  patient:{ profile:"elderly", age:68, sex:"F",
            complaint:"Feet swollen 2 weeks", history:"amlodipine 10mg od, metformin 500mg bd" },
  choices:[ {id:"A", label:"Dispense, advise salt restriction", tier:"safe"},
            {id:"B", label:"Refer for dose review", tier:"best"},
            {id:"C", label:"Stop amlodipine immediately", tier:"dangerous"} ],
  correct:"B",
  safetyChecks:[ {type:"adr", detail:"Edema is common ADR of amlodipine; not an emergency — refer, don't stop abruptly"} ],
  explanation:"…2–3 lines…", objectives:["pharmacology:Cvs"],
  xp:80, coins:30, penalty:{rep:10, coins:15},
  relatedMedicines:["amlo_5"], topics:["pharmacology","adr"] }
```

**Knowledge Card:** `{ id:"k1", subject:"pharmacology", topic:"Cvs", level:"beginner", title:"Amlodipine", fact:"…1 line…", detail:"…2 sentences…", relatedMedicine:"amlo_5" }`

**Achievement:** `{ id:"ach_patients_100", name:"People's Pharmacist", desc:"Serve 100 patients", condition:{stat:"patientsServed", op:">=", value:100}, rewards:{xp:200, coins:100} }`

**Player Save:** `{ version:1, player:{level, xp, coins, reputation, streak, lastDaily}, inventory:[{medId, qty, expiry}], upgrades:{shelves:2, ...}, unlocked:{medicines:[], cases:[]}, achievements:[], knowledge:{reviewBoxes, mastery}, stats:{patientsServed, accuracy, perSubject:{...}}, settings:{sound:true, animations:true} }`

**Upgrade:** `{ id:"shelves", name:"More Shelves", category:"growth", maxTier:5, cost:(t)=>100*t*t, effect:(state)=>{state.inventory.slots += 4} }`

**Daily:** `{ date:"2026-08-12", caseIds:[...5], completed:false, score:0 }` (date-seeded selection).

---

## 32. Game Balancing

**XP — level *l*→*l*+1 costs `100×l`.** Cumulative table:

| Level | XP to next | Cumulative XP | Level title |
|---|---|---|---|
| 1 | 100 | 0 | Junior Trainee |
| 2 | 200 | 100 | Junior Trainee |
| 3 | 300 | 300 | Junior Trainee |
| 4 | 400 | 600 | Junior Trainee |
| 5 | 500 | 1,000 | Pharmacy Assistant |
| 6 | 600 | 1,500 | Assistant |
| 7 | 700 | 2,100 | Assistant |
| 8 | 800 | 2,800 | Assistant |
| 9 | 900 | 3,600 | Assistant |
| 10 | 1,000 | 4,500 | Junior Pharmacist |

Sanity check: easy case ≈ 50 XP, medium ≈ 80, hard ≈ 120, perfect +20%, boss ≈ 200. So level 1→2 ≈ 2–3 cases; level 4→5 ≈ 5 cases. **No grind.**

**Coins:** easy 20, medium 35, hard 55, perfect +10, combo multiplier applies in challenge modes. Upgrade tier-1 ≈ 50–100 coins → affordable around level 3–4.

**Reputation:** starts 50, cap 100, floor 0; gains/losses per §11 matrix. Boss wins +10.

**Combo:** multiplier `1 + floor(combo/5)` cap ×5 (challenge modes only).

**Level rewards:** every level: +50 coins; milestone levels (5, 10, 20…): +200 coins + a cosmetic unlock + an upgrade discount.

**Economy check:** by level 10 a player has ~2,000+ coins earned and ~900 spent on the first shelf + inventory upgrades — positive, motivated, not flooded.

---

## 33. Low-MB Strategy

| Item | Estimated size | Approach |
|---|---|---|
| Code (all JS) | ~150–250 KB | Vanilla, no libraries, minifiable |
| CSS | ~40–60 KB | One file, CSS variables |
| Graphics | **0 KB** | Inline SVG + CSS shapes; no image files |
| Sounds | **0 KB** | WebAudio synthesized |
| Content data | ~80–200 KB | Compact JS records (20 meds / 30 cases) |
| Fonts | 0 KB | System font stack |
| Save data | ~10–50 KB | localStorage JSON |
| index.html | ~3 KB | — |
| **Core total** | **under 1 MB** | Well below the 10 MB budget |
| Capacitor wrapper | ~6–10 MB | One-time, added at packaging phase |

**Rules:** no image files in v1; if images are ever needed → WebP + lazy load; no external fonts; no frameworks; data files stay compact and gzip-friendly.

---

## 34. Performance Strategy

- Fast startup: content arrays load in one synchronous pass (<10ms), then boot.
- Minimal DOM: screens create elements once and reuse them; router hides/shows rather than rebuilds.
- No `requestAnimationFrame` loops outside modes that need them (challenge timer only).
- No background timers; save on events, not intervals.
- Event listeners consolidated; no per-frame layout thrash.
- Reduced-animation setting disables CSS transitions globally.

---

## 35. Security

- **No personal data collected, ever.** No login, email, or phone.
- No secret keys, no external APIs for core gameplay.
- All content ships locally; nothing leaves the device.
- The only "data" is the player's own save file, which they can export/import/delete.

---

## 36. Medical / Educational Safety

- **Disclaimer** on the splash screen and in About/Settings: *"Educational simulation — not a substitute for professional healthcare advice or clinical decision-making."*
- Content guidelines (docs/CONTENT_GUIDELINES.md): use accurate educational references; never present unsafe prescribing; always include referral scenarios; clearly mark "for educational example only" where appropriate.
- **Content-validation workflow:** every content record carries `source.reviewed`, `reviewer`, `lastReviewed`. A data test flags any record missing these fields so they can't ship unreviewed.

---

## 37. Testing Strategy

| Category | What | How |
|---|---|---|
| Unit (pure math) | xp, level, coins, combo, reputation, spaced-rep, difficulty | `node:test` in `tests/unit/` — no deps |
| Data validation | every medicine/case/card/achievement record well-formed + cross-referenced | `tests/data/validate.mjs` |
| Save/load | save→load round-trip, version migration, corrupt-save handling | unit + manual |
| Progression | level-up, boss unlocks, upgrade gates | manual checklist |
| UI | every screen reachable, buttons work | manual checklist in docs/TESTING_PLAN.md |
| Offline | full play with network disabled | manual (browser devtools → offline) |
| Mobile | small screen sizes, touch targets | browser responsive mode + final Android device |
| Content safety | no unsafe instructions, disclaimers present | content review + validation test |

Run tests with `node --test` (no framework). Every phase ends with the relevant test checkbox set.

---

## 38. MVP Definition (v0.2)

- One pharmacy (simulator), customer queue
- **20 medicines** · **30 cases** (mix of easy/normal/hard)
- Medicine selection + safety checks + counselling step
- XP, coins, reputation, levels (1–20 titles)
- Knowledge cards + Knowledge Bank (5 subjects, beginner level)
- Local save/load, offline play
- 8–10 basic achievements
- Settings (sound, animation), disclaimer screen
- Modes 2–5, inventory, upgrades, daily challenge, spaced repetition → **all Phase 9+ additions, AFTER MVP is stable.**

---

## 39. Development Phases

Each phase includes: objective · files · features · dependencies · tests · completion criteria · complexity · risks. Summary (details per phase live in docs/ROADMAP.md):

| Phase | Objective | Complexity | Key tests |
|---|---|---|---|
| 0 | Architecture docs (this blueprint → 8 docs) | Low | doc review |
| 1 | Project setup: folders, index.html, config, utils, router skeleton, local server note | Low | open in browser, blank boot |
| 2 | Core engine: eventBus, state, save.js (versioned), systems (xp/coins/rep/level/combo) | Med | unit tests |
| 3 | Pharmacy screen + customer queue + basic layout | Med | manual UI |
| 4 | Case flow: caseRunner, case screen, choices, result | High | full case test |
| 5 | Safety + counselling steps, penalties | Med | safety unit + manual |
| 6 | Rewards wiring, level-ups, toasts | Low | unit |
| 7 | Medicine data + inventory + expiry | Med | data validation |
| 8 | Knowledge Bank screen + card unlocks | Med | data validation |
| 9 | Spaced repetition + review flow | Med | unit |
| 10 | Upgrades + economy | Med | economy test |
| 11 | Achievements | Low | unit |
| 12 | Daily challenge + streak | Low | date unit |
| 13 | Boss cases (every 5 levels) | Med | case test |
| 14 | Audio (synthesized SFX) + settings | Low | manual |
| 15 | Visual polish, animations, reduced-motion | Low | manual |
| 16 | Optimization + offline verification | Low | perf check |
| 17 | Full test pass + content safety review | Med | all suites |
| 18 | Android packaging (Capacitor) | Med | on-device test |
| 19 | Release prep (README, icons, docs) | Low | checklist |

Dependencies noted in the roadmap — e.g., Phase 4 depends on 2–3; Phase 13 depends on 4 + 6. No phase depends on Android until Phase 18.

---

## 40. Version Roadmap

| Version | Contents |
|---|---|
| v0.1 | Prototype: single screen, 5 medicines, 8 cases, no save |
| **v0.2** | **Playable MVP** (per §38) |
| v0.3 | Learning system: knowledge bank complete, spaced repetition, weak-topic |
| v0.4 | Progression: inventory, upgrades, achievements, daily, bosses |
| v0.5 | Polish: audio, animations, accessibility, optimization |
| v1.0 | Complete first release + Android package |
| v1.1+ | Modes 2–5 (challenge, drug match, lab), 100 medicines, 300+ cases, GPAT packs, more languages |

---

## 41. File-by-File Plan

(Every file: purpose · responsibilities · dependencies · complexity · what must NOT live in it.)

- **`index.html`** — entry point. Loads `main.js`, holds the screen mount container, disclaimer footer. Nothing else. *(No logic.)*
- **`src/main.js`** — boot sequence: load data → load save (migrate) → emit `appBooted` → router goes to Splash. *(No game rules.)*
- **`src/config.js`** — every magic number (§31/§32 constants), `SAVE_VERSION`. *(No content.)*
- **`src/core/eventBus.js`** — `on/emit/off`. *(No game logic.)*
- **`src/core/router.js`** — screen registry + show/hide. *(No case logic.)*
- **`src/core/state.js`** — the current runtime player state + getters. *(No calculations.)*
- **`src/core/utils.js`** — `clamp`, `sum`, `formatNum`, seeded RNG, `dateStr`. *(No game rules.)*
- **`src/data/*`** — content arrays only. *(No functions that mutate state; no DOM.)*
- **`src/systems/*`** — pure functions: `xpForLevel`, `comboMultiplier`, `reputationDelta`, `upgradeCost`, `nextReviewDate`. *(No DOM, no state mutation — return values.)*
- **`src/game/caseRunner.js`** — orchestrates a case: pick case → show choices → run safety → counselling → compute outcome → emit `caseCompleted`. *(No medicine content.)*
- **`src/game/safety.js`** — check a chosen medicine against patient profile + allergies + other meds. Pure-ish, testable.
- **`src/modes/*`** — each mode as a self-contained mini-flow reusing caseRunner data.
- **`src/learning/*`** — knowledge bank data access + spaced repetition + weak-topic detection (reads per-subject accuracy stats).
- **`src/ui/dom.js`** — `el(tag, attrs, children)` helper. *(No game logic.)*
- **`src/ui/components/*`** — reusable widgets, styled by CSS classes.
- **`src/ui/screens/*`** — one module per screen; each listens to events and renders state. *(No reward math.)*
- **`src/storage/save.js`** — `save()`, `load()`, `migrate()`, `export/import/reset`. The only file touching localStorage.
- **`src/audio/sound.js`** — WebAudio beep synth + `play(name)` + mute. The only file touching AudioContext.
- **`src/css/main.css`** — all styles; design tokens in `:root`.
- **`tests/*`** — `node --test` unit + data validation.
- **`docs/*`** — the 8 planning docs.

---

## 42. OpenCode Workflow

Rules: **never rewrite the whole project.** Each request: inspect existing files → identify affected files → smallest change → test → report (files changed, features, tests, problems, next step). Full example + per-phase prompts live in `docs/OPENCODE_WORKFLOW.md`.

Phase 1 example prompt:

> "Phase 1 of PHARMA RUSH. Create the project skeleton per docs/ARCHITECTURE.md §Folder Structure: index.html, src/config.js, src/core/utils.js, src/core/router.js (screen registry showing one blank 'Splash' screen), src/css/main.css with design tokens, src/main.js boot that logs 'PHARMA RUSH booted'. No game logic yet. Test: open index.html via a local server, confirm the Splash screen renders and the log appears."

---

## 43. Risks

| Risk | Mitigation |
|---|---|
| Content accuracy mistakes | reviewed-field enforcement + data test + content guidelines doc |
| localStorage data loss on update | save versioning + migration + export/backup |
| Scope creep before MVP | hard gate: nothing beyond §38 ships before v0.2 is playable |
| Player skips learning | 1-line facts, case-based learning, combo rewards tied to understanding |
| Economy imbalance | formula-driven balancing + the §32 table + playtest checkpoints |
| Low-end device jank | no canvas, no images, event-driven rendering, reduced-motion setting |

---

## 44. Future Expansion

Engine stays stable while content grows: 100→300→1,000 medicines (data only); 300+ cases; GPAT subject packs; more languages via a `strings` translation table; more lab mini-games as data + one small mode module each; optional online leaderboards in a much later version (explicitly out of scope for v1). The data-driven architecture makes all of this additive, not rewrites.

---

## 45. Final Recommended Architecture

**Vanilla HTML + CSS + ES modules, zero dependencies, one local server for dev, localStorage for saves, WebAudio for sound, inline SVG for art, data-driven content, event-bus decoupling, node:test for verification, Capacitor for the eventual APK.** Build in 19 ordered phases with a playable MVP (20 medicines / 30 cases / full loop + save) before any advanced feature. Every system from the spec is represented; the codebase target stays **under 1 MB**.
