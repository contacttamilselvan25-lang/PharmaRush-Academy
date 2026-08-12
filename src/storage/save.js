import { SAVE_KEY, SAVE_VERSION, GAME_VERSION } from "../config.js";
import { defaultState } from "../core/state.js";

const migrations = {};

function mergeDefaults(base, override) {
  const out = { ...base };
  for (const key of Object.keys(override ?? {})) {
    if (base[key] && typeof base[key] === "object" && !Array.isArray(base[key]) && override[key] && typeof override[key] === "object") {
      out[key] = mergeDefaults(base[key], override[key]);
    } else {
      out[key] = override[key];
    }
  }
  return out;
}

export function freshSave() {
  return defaultState();
}

export function serialize(state) {
  return JSON.stringify({
    ...state,
    version: SAVE_VERSION,
    gameVersion: GAME_VERSION,
    savedAt: Date.now(),
  });
}

export function save(state) {
  const data = serialize(state);
  try {
    localStorage.setItem(SAVE_KEY, data);
  } catch (err) {
    console.error("[save] could not write save", err);
  }
  return data;
}

export function load() {
  const raw = localStorage.getItem(SAVE_KEY);
  if (!raw) return null;
  try {
    const parsed = JSON.parse(raw);
    return migrate(parsed);
  } catch (err) {
    console.error("[save] corrupted save; starting fresh", err);
    backup(raw);
    return null;
  }
}

export function migrate(saveData) {
  if (!saveData || typeof saveData !== "object") return null;

  let s = saveData;
  let version = s.version ?? 1;

  if (version > SAVE_VERSION) {
    backup(JSON.stringify(s));
    return null;
  }

  while (version < SAVE_VERSION) {
    const step = migrations[version];
    if (!step) {
      backup(JSON.stringify(s));
      return null;
    }
    s = step(s);
    version += 1;
  }

  s.version = SAVE_VERSION;
  return mergeDefaults(defaultState(), s);
}

export function exportSave(state) {
  return JSON.stringify({
    ...state,
    version: SAVE_VERSION,
    gameVersion: GAME_VERSION,
    exportedAt: Date.now(),
  });
}

export function importSave(json) {
  let parsed;
  try {
    parsed = JSON.parse(json);
  } catch (err) {
    throw new Error("Invalid save file: not valid JSON");
  }
  const migrated = migrate(parsed);
  if (!migrated) throw new Error("Save file is from an incompatible version");
  return migrated;
}

export function reset() {
  localStorage.removeItem(SAVE_KEY);
}

function backup(raw) {
  try {
    localStorage.setItem(SAVE_KEY + ".bak", raw);
  } catch (err) {
    /* backup is best-effort */
  }
}
