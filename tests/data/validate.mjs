import { existsSync } from "node:fs";
import { pathToFileURL } from "node:url";

const errors = [];
const skipped = [];

const datasets = [
  { path: "src/data/medicines.js", key: "medicines", check: checkMedicine },
  { path: "src/data/cases.js", key: "cases", check: checkCase },
  { path: "src/data/knowledge.js", key: "cards", check: checkKnowledgeCard },
  { path: "src/data/achievements.js", key: "achievements", check: checkAchievement },
  { path: "src/data/upgrades.js", key: "upgrades", check: checkUpgrade },
];

function fail(id, message) {
  errors.push(`${id}: ${message}`);
}

function requireSource(record, id) {
  const src = record.source;
  if (!src) return fail(id, "missing source block");
  if (!src.reference) fail(id, "source.reference missing");
  if (src.reviewed !== true) fail(id, "source.reviewed must be true");
  if (!src.reviewer) fail(id, "source.reviewer missing");
  if (!src.lastReviewed) fail(id, "source.lastReviewed missing");
}

function recordId(r) {
  return r.id ?? r.caseId;
}

function uniqueIds(records) {
  const seen = new Set();
  for (const r of records) {
    const id = recordId(r);
    if (!id) return fail("(record)", "missing id");
    if (seen.has(id)) return fail(id, "duplicate id");
    seen.add(id);
  }
}

function checkMedicine(r) {
  if (typeof r.genericName !== "string" || !r.genericName) fail(r.id, "genericName missing");
  if (typeof r.drugClass !== "string") fail(r.id, "drugClass missing");
  if (!Array.isArray(r.indications) || r.indications.length === 0) fail(r.id, "indications missing");
  if (!Array.isArray(r.subjects) || r.subjects.length === 0) fail(r.id, "subjects missing");
  if (!Number.isInteger(r.difficulty) || r.difficulty < 1 || r.difficulty > 3) fail(r.id, "difficulty must be 1..3");
  if (!Array.isArray(r.counsellingPoints) || r.counsellingPoints.length === 0) fail(r.id, "counsellingPoints missing");
  if (!Array.isArray(r.learningFacts) || r.learningFacts.length === 0) fail(r.id, "learningFacts missing");
  requireSource(r, r.id);
}

function checkCase(r) {
  if (typeof r.title !== "string" || !r.title) fail(r.id, "title missing");
  if (!["easy", "normal", "hard", "expert", "boss"].includes(r.difficulty)) fail(r.id, `invalid difficulty "${r.difficulty}"`);
  if (!r.patient || typeof r.patient !== "object") fail(r.id, "patient missing");
  if (!Array.isArray(r.choices) || r.choices.length < 2) fail(r.id, "choices need at least 2");
  if (!r.correct) fail(r.id, "correct choice missing");
  const ids = new Set(r.choices.map((c) => c.id));
  if (!ids.has(r.correct)) fail(r.id, `correct "${r.correct}" not among choices`);
  for (const c of r.choices) {
    if (!["best", "safe", "suboptimal", "dangerous"].includes(c.tier)) fail(r.id, `choice "${c.id}" invalid tier "${c.tier}"`);
    if (!ids.has(c.id)) fail(r.id, `duplicate choice id "${c.id}"`);
  }
  if (!r.explanation) fail(r.id, "explanation missing");
  if (!Array.isArray(r.objectives) || r.objectives.length === 0) fail(r.id, "objectives missing");
  if (r.xp != null && !Number.isInteger(r.xp)) fail(r.id, "xp must be an integer");
  if (r.coins != null && !Number.isInteger(r.coins)) fail(r.id, "coins must be an integer");
  if (!r.penalty || typeof r.penalty !== "object") fail(r.id, "penalty missing");
  requireSource(r, r.id);
}

function checkKnowledgeCard(r) {
  if (!r.subject) fail(r.id, "subject missing");
  if (!["beginner", "intermediate", "advanced"].includes(r.level)) fail(r.id, `invalid level "${r.level}"`);
  if (!r.fact) fail(r.id, "fact missing");
  if (!r.detail) fail(r.id, "detail missing");
  requireSource(r, r.id);
}

function checkAchievement(r) {
  if (!r.name) fail(r.id, "name missing");
  if (!r.condition || typeof r.condition !== "object") fail(r.id, "condition missing");
  if (!r.rewards || typeof r.rewards !== "object") fail(r.id, "rewards missing");
}

function checkUpgrade(r) {
  if (!r.name) fail(r.id, "name missing");
  if (!Number.isInteger(r.maxTier) || r.maxTier < 1) fail(r.id, "maxTier missing");
  if (typeof r.cost !== "function") fail(r.id, "cost must be a function of tier");
  if (!r.effect || typeof r.effect !== "object") fail(r.id, "effect missing");
}

async function run() {
  for (const ds of datasets) {
    if (!existsSync(ds.path)) {
      skipped.push(`${ds.path} (not created yet)`);
      continue;
    }
    try {
      const mod = await import(pathToFileURL(ds.path).href);
      const records = mod[ds.key];
      if (!Array.isArray(records)) {
        errors.push(`${ds.path}: expected export "${ds.key}" to be an array`);
        continue;
      }
      uniqueIds(records);
      for (const r of records) ds.check(r);
    } catch (err) {
      errors.push(`${ds.path}: failed to import — ${err.message}`);
    }
  }

  if (skipped.length) console.log(`[validate] skipped: ${skipped.join(", ")}`);
  if (errors.length) {
    console.error(`[validate] FAILED (${errors.length}):`);
    for (const e of errors) console.error(`  - ${e}`);
    process.exit(1);
  }
  console.log(`[validate] PASS (${datasets.length - skipped.length} datasets checked)`);
}

run();
