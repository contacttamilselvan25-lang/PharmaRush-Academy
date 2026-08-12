# PHARMA RUSH — Data Schemas

All content is data-driven. Adding content never requires touching game logic. Subject tags use `subject:topic`, e.g. `pharmacology:Cvs`, `pharmaceutics:DosageForms`, `pharmacognosy:Alkaloids`, `pharmaceuticalChemistry:Medicinal`, `pharmacyPractice:Interactions`.

## Medicine (`src/data/medicines.js`)

```js
{
  id: "amlo_5",                       // unique, kebab-case
  genericName: "Amlodipine",
  brands: ["Norvasc", "Amlogard"],    // optional
  drugClass: "Calcium Channel Blocker",
  category: "Antihypertensive",
  mechanism: "Blocks L-type Ca channels in vascular smooth muscle",
  indications: ["Hypertension", "Chronic stable angina"],
  dosageForm: "Tablet",
  route: "Oral",
  strengths: ["2.5", "5", "10"],      // mg
  contraindications: ["Hypersensitivity", "Severe hypotension"],
  interactions: ["CYP3A4 inhibitors", "Simvastatin >20mg"],
  adrs: { common: ["Peripheral edema", "Headache", "Flushing"], serious: [] },
  warnings: ["Avoid in acute MI"],
  counsellingPoints: ["Take once daily, same time", "Avoid grapefruit juice"],
  storage: "RT, away from light",
  difficulty: 1,                       // 1=easy 2=normal 3=hard
  subjects: ["pharmacology:Cvs"],
  expiryDays: 365,
  cost: 25,                            // base purchase cost, coins
  learningFacts: ["First-line antihypertensive in most adults"],
  source: { reference: "BNF 2025", reviewed: true, reviewer: "Dr X", lastReviewed: "2026-01-01" }
}
```

## Patient profile (`src/data/patientProfiles.js`)

```js
{
  id: "elderly",
  name: "Elderly",
  minAge: 65,
  flags: ["polypharmacy", "reduced clearance"],
  traits: ["slower metabolism", "higher fall risk"]
}
```

## Case (`src/data/cases.js`)

```js
{
  caseId: "c010",
  difficulty: "normal",                // easy | normal | hard | expert | boss
  title: "Swollen Feet",
  patient: {
    profile: "elderly", age: 68, sex: "F",
    complaint: "Feet swollen 2 weeks",
    history: "amlodipine 10mg od, metformin 500mg bd",
    allergies: []
  },
  choices: [
    { id: "A", label: "Dispense, advise salt restriction", tier: "safe" },
    { id: "B", label: "Refer for dose review", tier: "best" },
    { id: "C", label: "Stop amlodipine immediately", tier: "dangerous" }
  ],
  correct: "B",
  safetyChecks: [
    { type: "adr", detail: "Edema is a common dose-dependent ADR of amlodipine; do not stop abruptly." }
  ],
  explanation: "…2–3 short lines…",
  objectives: ["pharmacology:Cvs"],
  xp: 80, coins: 30,
  penalty: { rep: 10, coins: 15 },
  relatedMedicines: ["amlo_5"],
  topics: ["pharmacology", "adr"]
}
```

### Choice tiers

- `best` → perfect: 100% XP + 20% bonus, full coins, rep +3.
- `safe` → 75% XP, full coins, rep +1.
- `suboptimal` → 40% XP, half coins, rep −2.
- `dangerous` → 0% XP, coin penalty, rep −10, red safety warning.

## Knowledge card (`src/data/knowledge.js`)

```js
{
  id: "k1",
  subject: "pharmacology", topic: "Cvs", level: "beginner",
  title: "Amlodipine",
  fact: "First-line antihypertensive; causes peripheral edema.",
  detail: "Amlodipine is a long-acting dihydropyridine CCB. Edema is dose-dependent.",
  relatedMedicine: "amlo_5",
  source: { reference: "BNF 2025", reviewed: true, reviewer: "Dr X", lastReviewed: "2026-01-01" }
}
```

## Achievement (`src/data/achievements.js`)

```js
{
  id: "ach_patients_100",
  name: "People's Pharmacist",
  desc: "Serve 100 patients",
  condition: { stat: "patientsServed", op: ">=", value: 100 },
  rewards: { xp: 200, coins: 100 }
}
```

## Upgrade (`src/data/upgrades.js`)

```js
{
  id: "shelves",
  name: "More Shelves",
  category: "growth",
  maxTier: 5,
  cost: (t) => 100 * t * t,
  requiresLevel: 3,
  effect: { inventorySlots: 4 }        // added per tier; applied by systems/level.js
}
```

## Player save (`src/storage/save.js`)

```js
{
  version: 1,
  player: { level: 1, xp: 0, coins: 50, reputation: 50, streak: 0, lastDaily: null },
  inventory: [ { medId: "amlo_5", qty: 10, expiry: "2027-08-12" } ],
  upgrades: { shelves: 1 },
  unlocked: { medicines: ["amlo_5"], cases: [] },
  achievements: [],
  knowledge: { reviewBoxes: {}, mastery: {} },
  stats: { patientsServed: 0, casesCompleted: 0, accuracy: 0,
           interactionsCaught: 0, zeroErrorStreak: 0, perSubject: {} },
  settings: { sound: true, animations: true }
}
```

## Daily challenge (`src/data/daily.js`)

```js
{
  date: "2026-08-12",                  // local date string (YYYY-MM-DD)
  caseIds: ["c010", "c003", "c021", "c008", "c015"],   // date-seeded selection
  completed: false,
  score: 0
}
```

## Content rules

- Every content record needs an `id` and a valid `source` block (reference, reviewed, reviewer, lastReviewed) — enforced by `tests/data/validate.mjs`.
- Cross-references (case → medicine, knowledge → medicine) are validated to point at existing records.
- Content files must not import game logic and must not mutate state.
