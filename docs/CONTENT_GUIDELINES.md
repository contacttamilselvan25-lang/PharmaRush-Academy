# PHARMA RUSH — Content Guidelines

## Safety-first rules

1. This is an **educational simulation**, not a substitute for professional healthcare advice. The disclaimer on the splash screen and in Settings says so.
2. **Never** write content that instructs prescribing or medication changes as fact. Frame everything as pharmacy decisions within the game.
3. Always include **referral scenarios** where a real pharmacist would refer (doctor or emergency).
4. Clearly distinguish: pharmacist counselling · prescription requirements · referral.
5. Never reward unsafe real-world behaviour (wrong doses, abrupt stops, OTC misuse).
6. Use accurate educational references (BNF, standard textbooks) during content creation.

## Content validation workflow

Every content record must carry a source block:

```js
source: { reference: "BNF 2025", reviewed: true, reviewer: "Dr X", lastReviewed: "2026-01-01" }
```

- `tests/data/validate.mjs` fails on any record missing `reviewed: true` or a reviewer.
- Reviewer signs off before content ships.
- `lastReviewed` is refreshed on edits.

## Writing style

- Explanations: max 2–3 short lines.
- Facts: one line.
- Plain, simple language. Avoid jargon unless it is the lesson.
- Medicine names: generic names; brands optional in parentheses.

## Topic tags

Use the subject tree from docs/LEARNING_SYSTEM.md:
`pharmacology:Cvs`, `pharmaceutics:DosageForms`, `pharmacognosy:Alkaloids`,
`pharmaceuticalChemistry:Medicinal`, `pharmacyPractice:Interactions`, etc.

## Review checklist (before shipping content)

- [ ] Educational accuracy checked against a reference
- [ ] source block complete
- [ ] No unsafe instructions
- [ ] Referral handled where appropriate
- [ ] Explanations short
- [ ] At least one learning fact surfaced
