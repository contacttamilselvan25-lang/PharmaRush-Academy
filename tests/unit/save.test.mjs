import { test, beforeEach } from "node:test";
import assert from "node:assert/strict";

import { defaultState } from "../../src/core/state.js";
import {
  save,
  load,
  serialize,
  exportSave,
  importSave,
  reset,
} from "../../src/storage/save.js";

const store = new Map();

globalThis.localStorage = {
  getItem: (k) => (store.has(k) ? store.get(k) : null),
  setItem: (k, v) => store.set(k, String(v)),
  removeItem: (k) => store.delete(k),
};

beforeEach(() => store.clear());

test("save/load round-trip preserves state", () => {
  const state = defaultState();
  state.player.coins = 123;
  state.player.xp = 456;
  state.inventory = [{ medId: "amlo_5", qty: 10, expiry: "2027-01-01" }];
  save(state);
  const loaded = load();
  assert.equal(loaded.player.coins, 123);
  assert.equal(loaded.player.xp, 456);
  assert.deepEqual(loaded.inventory, [{ medId: "amlo_5", qty: 10, expiry: "2027-01-01" }]);
});

test("load fills missing fields with defaults", () => {
  localStorage.setItem("pharmaRush.save", JSON.stringify({ version: 1, player: { coins: 7 } }));
  const loaded = load();
  assert.equal(loaded.player.coins, 7);
  assert.equal(loaded.player.level, 1);
  assert.equal(loaded.player.reputation, 50);
  assert.deepEqual(loaded.upgrades, {});
});

test("load with corrupted JSON returns null", () => {
  localStorage.setItem("pharmaRush.save", "{not json");
  assert.equal(load(), null);
});

test("load with a future version returns null and backs up", () => {
  localStorage.setItem("pharmaRush.save", JSON.stringify({ version: 99, player: {} }));
  assert.equal(load(), null);
  assert.ok(localStorage.getItem("pharmaRush.save.bak"));
});

test("no save present returns null", () => {
  assert.equal(load(), null);
});

test("export/import round-trip", () => {
  const state = defaultState();
  state.player.xp = 999;
  const json = exportSave(state);
  const imported = importSave(json);
  assert.equal(imported.player.xp, 999);
});

test("importSave rejects invalid json", () => {
  assert.throws(() => importSave("nope"));
});

test("reset clears the save", () => {
  save(defaultState());
  assert.ok(localStorage.getItem("pharmaRush.save"));
  reset();
  assert.equal(localStorage.getItem("pharmaRush.save"), null);
});

test("serialize stamps version and game version", () => {
  const data = JSON.parse(serialize(defaultState()));
  assert.equal(data.version, 1);
  assert.equal(typeof data.gameVersion, "string");
  assert.equal(typeof data.savedAt, "number");
});
