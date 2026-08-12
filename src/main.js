import { GAME_VERSION } from "./config.js";
import { initRouter, registerScreen, showScreen } from "./core/router.js";
import { setState } from "./core/state.js";
import { emit } from "./core/eventBus.js";
import { load, save, freshSave } from "./storage/save.js";
import { setMuted, initAudio } from "./audio/sound.js";
import { processExpiry } from "./systems/inventory.js";
import * as splash from "./ui/screens/splash.js";
import * as menu from "./ui/screens/menu.js";
import * as pharmacy from "./ui/screens/pharmacy.js";
import * as caseScreen from "./ui/screens/case.js";
import * as knowledgeBank from "./ui/screens/knowledgeBank.js";
import * as inventory from "./ui/screens/inventory.js";
import * as upgrades from "./ui/screens/upgrades.js";
import * as achievements from "./ui/screens/achievements.js";
import * as profile from "./ui/screens/profile.js";
import * as settings from "./ui/screens/settings.js";
import * as daily from "./ui/screens/daily.js";

function boot() {
  const app = document.getElementById("app");
  if (!app) throw new Error("App mount node missing");

  let state = load();
  if (!state) {
    state = freshSave();
    save(state);
  }
  const expired = processExpiry(state);
  if (expired.length) save(state);
  setState(state);

  setMuted(!state.settings.sound);
  initAudio();
  if (!state.settings.animations) document.documentElement.classList.add("no-anim");
  document.addEventListener("pointerdown", () => initAudio(), { once: true });

  initRouter(app);
  registerScreen("splash", splash);
  registerScreen("menu", menu);
  registerScreen("pharmacy", pharmacy);
  registerScreen("case", caseScreen);
  registerScreen("knowledgeBank", knowledgeBank);
  registerScreen("inventory", inventory);
  registerScreen("upgrades", upgrades);
  registerScreen("achievements", achievements);
  registerScreen("profile", profile);
  registerScreen("settings", settings);
  registerScreen("daily", daily);

  console.log(`PHARMA RUSH booted — v${GAME_VERSION}`);

  emit("appBooted", { version: GAME_VERSION });
  showScreen("splash");
}

window.addEventListener("DOMContentLoaded", boot);
