# 🏥 PHARMA RUSH

> **Play. Practice. Learn. Become the Best Pharmacist.**

A lightweight, offline-first 2D pharmacy simulation and educational game. Run your own pharmacy, serve customers, make real pharmacy decisions, and grow from a *Junior Trainee* into a *Pharma Master* — all while building the clinical instincts needed for B.Pharm / D.Pharm / PharmD exams and GPAT.

Built with **zero frameworks and zero dependencies** — just HTML, CSS, and vanilla JavaScript (ES Modules). Everything runs on-device, fully offline, with a core size **under 1 MB**.

---

## ✨ Features

### Core gameplay — the full loop
```
CUSTOMER ARRIVES → UNDERSTAND CASE → PHARMACY DECISION → SAFETY CHECK
        → COUNSEL PATIENT → CASE RESULT → REWARD → KNOWLEDGE UNLOCK
        → UPGRADE → NEXT CUSTOMER
```

- **Case-based learning** — every customer is a mini pharmacy case: read the complaint → choose the right action → pass the allergy / interaction / contraindication safety check (or catch a hazard) → counsel the patient → get a result with a short explanation and **one knowledge fact**. Never a wall of text.
- **Safety first** — built-in consequences matrix rewards *best / safe* choices and penalizes *suboptimal / dangerous* ones (XP, coins, and reputation — down to −10 reputation for unsafe calls).
- **Positive reinforcement** — combo streaks, perfect-case bonuses, and level-ups keep the loop rewarding without adding grind.

### Content (all data-driven — add more without touching the engine)
| Category | Count |
|---|---|
| Medicines | 20 |
| Pharmacy cases (easy / normal / hard + boss) | 30 |
| Knowledge cards (5 subjects × 3 levels) | 25 |
| Achievements | 10 |
| Pharmacy upgrades | 7 |

### Progression & economy
- **XP** — each level *l*→*l*+1 costs `100 × l`. No grind.
- **Levels & titles** — Junior Trainee → Pharmacy Assistant → Junior Pharmacist → Senior Pharmacist → Clinical Specialist → Pharma Master → *(75+) Legendary Pharmacist*.
- **Coins** — earned per case, spent on gameplay-affecting upgrades (never pay-to-win; no real-money purchases).
- **Reputation (0–100)** — good service up, mistakes down; reach ≥75 to unlock advanced patients.

### Systems
- 🧠 **Knowledge Bank** — browse & collect cards by subject (Pharmacology, Pharmaceutics, Pharmaceutical Chemistry, Pharmacognosy, Pharmacy Practice) and level.
- 🔁 **Spaced repetition** — lightweight review boxes (just-learned → +1d → +3d → +7d → +14d → mastered).
- 📉 **Weak-topic detection** — per-subject accuracy flags subjects that need practice and suggests a recovery path.
- 📦 **Inventory** — stock, expiry timers, and restocking.
- 🚀 **Upgrades** — shelves, inventory system, counselling area, storage, assistant, equipment.
- 🎯 **Achievements** — 10 unlockable achievements with toast + rewards.
- 📅 **Daily Challenge** — 5 curated cases per day (date-seeded, no server) with a streak counter.
- 🎵 **Synthesized audio** — Web Audio SFX (zero audio files).
- 💾 **Auto-save** — localStorage with versioned migration; export / import / reset your save from the Settings screen.

### Design & performance
- Mobile-first, large touch targets (≥44 px), reduced-motion support.
- **0 KB of images and audio** — inline SVG icons, CSS shapes, and Web Audio synth.
- Event-bus architecture keeps game logic, UI, data, and storage fully decoupled (systems never touch the DOM; screens never compute rewards).

---

## 🚀 Getting Started

### Prerequisites
- **Node.js** (any recent LTS) — only needed for the local dev server and tests.
- A modern browser (Chrome, Edge, Firefox, Safari).

### Run it — the easy way
On Windows, just double-click **`START_GAME.bat`**. It starts a local server and opens the game in your browser automatically.

### Run it — manually

**Node.js:**
```bash
node server.mjs
```
Then open **http://localhost:8123** in your browser.

**VS Code (Live Server):**
1. Install the *Live Server* extension.
2. Right-click `index.html` → **Open with Live Server**.

**Python:**
```bash
python -m http.server 8000
```
Then open **http://localhost:8000**.

> ⚠️ Opening `index.html` directly by double-clicking will **not** work — browsers block ES module imports over the `file://` protocol. Always use a local server.

---

## 🧪 Testing

Tests use Node's built-in test runner — **no dependencies installed**.

```bash
npm test                 # run everything (unit tests + data validation)
npm run test:unit        # unit tests only
node tests/data/validate.mjs   # validate all content data records
```

Current status: **51 unit tests passing + content validation passing** (20 medicines, 30 cases, 25 knowledge cards, 10 achievements, 7 upgrades).

---

## 📁 Project Structure

```
pharma-rush/
├── index.html            # entry point
├── server.mjs            # zero-dependency static dev server
├── START_GAME.bat        # one-click launcher (Windows)
├── src/
│   ├── main.js           # bootstrap: data → save → router
│   ├── config.js         # single source of truth for balance numbers
│   ├── core/             # eventBus, router, state, utils
│   ├── data/             # CONTENT ONLY — medicines, cases, knowledge, achievements, upgrades
│   ├── systems/          # pure math, unit-testable, no DOM
│   ├── game/             # caseRunner, safety, counselling, boss
│   ├── learning/         # knowledge bank, spaced repetition, weak-topic
│   ├── modes/            # (reserved) challenge / drug-match / lab modes
│   ├── ui/               # screens + reusable components
│   ├── storage/save.js   # the only module that touches localStorage
│   ├── audio/sound.js    # the only module that touches Web Audio
│   └── css/main.css      # all styles, design tokens in :root
├── docs/                 # architecture, game design, roadmap, testing plan, and more
├── tests/
│   ├── unit/             # node:test unit tests
│   └── data/validate.mjs # content data validation
└── README.md
```

**Architecture notes:** `data/` = content only · `systems/` = pure math · `game/` = case orchestration · `ui/` = presentation · `core/` = plumbing. The engine never contains medicine-specific logic — adding 100 or 1,000 medicines later is pure data entry.

---

## 🗺️ Roadmap

| Version | Contents |
|---|---|
| v0.1 | Prototype: single screen, 5 medicines, 8 cases, no save |
| **v0.2** | **✅ Playable MVP** — 20 meds / 30 cases / full loop + save + achievements |
| v0.3 | Learning system: knowledge bank complete, spaced repetition, weak-topic |
| v0.4 | Progression: inventory, upgrades, achievements, daily, bosses |
| v0.5 | Polish: audio, animations, accessibility, optimization |
| v1.0 | First release + Android package (Capacitor — same files, no rewrite) |
| v1.1+ | Modes 2–5 (30-second challenge, drug match, lab mini-games), 100 medicines, 300+ cases, GPAT packs |

Full build plan per phase lives in [`docs/ROADMAP.md`](docs/ROADMAP.md).

---

## 📚 Documentation

| Document | Purpose |
|---|---|
| [`docs/ARCHITECTURE.md`](docs/ARCHITECTURE.md) | Master architecture blueprint (schemas, balance tables, folder rules) |
| [`docs/GAME_DESIGN.md`](docs/GAME_DESIGN.md) | Game design document & design pillars |
| [`docs/DATA_SCHEMA.md`](docs/DATA_SCHEMA.md) | Data record schemas |
| [`docs/LEARNING_SYSTEM.md`](docs/LEARNING_SYSTEM.md) | Educational system design |
| [`docs/TESTING_PLAN.md`](docs/TESTING_PLAN.md) | Test categories & procedures |
| [`docs/CONTENT_GUIDELINES.md`](docs/CONTENT_GUIDELINES.md) | Medical content safety rules |
| [`docs/LOW_MB_OPTIMIZATION.md`](docs/LOW_MB_OPTIMIZATION.md) | Size/performance strategy |
| [`docs/ROADMAP.md`](docs/ROADMAP.md) | Phased build roadmap |

---

## 🛡️ Safety & Disclaimer

> **Educational simulation — not a substitute for professional healthcare advice or clinical decision-making.**

- No personal data is collected, ever. No login, no email, no phone, no tracking.
- No secret keys, no external APIs for core gameplay — everything runs on-device.
- Every content record carries a `source` block with a reviewer and review date, enforced by the data-validation test so nothing ships unreviewed.
- The game always preserves referral scenarios and never endorses unsafe real-world behaviour.

---

## 🤝 Contributing

This project is built around an **on-device, data-driven, zero-framework** philosophy:

1. **Content** (new medicines, cases, cards) = edit the arrays in `src/data/` — no engine changes.
2. **Bug fixes / features** = keep systems pure (no DOM), keep storage in `save.js`, keep balance in `config.js`.
3. **Run the tests** — `npm test` — before submitting anything.

---

*Made with ❤️ for pharmacy students, GPAT aspirants, and curious pharmacists everywhere.*