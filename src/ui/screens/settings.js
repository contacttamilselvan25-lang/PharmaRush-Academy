import { el } from "../dom.js";
import { getState } from "../../core/state.js";
import { showScreen } from "../../core/router.js";
import { showToast } from "../components/toast.js";
import { play } from "../../audio/sound.js";
import { save, exportSave, importSave, reset } from "../../storage/save.js";
import { setMuted } from "../../audio/sound.js";

export function render(container) {
  const state = getState();

  container.append(el("div", { class: "screen" }, [
    el("div", { class: "pharmacy-top" }, [
      el("button", { class: "btn-icon", text: "‹", "aria-label": "Back", onclick: () => { play("click"); showScreen("menu"); } }),
      el("h1", { class: "screen-title", text: "Settings" }),
    ]),
    el("div", { class: "settings-list" }, [
      toggleRow("Sound", state.settings.sound, (v) => {
        state.settings.sound = v;
        setMuted(!v);
        save(state);
        showScreen("settings");
      }),
      toggleRow("Animations", state.settings.animations, (v) => {
        state.settings.animations = v;
        document.documentElement.classList.toggle("no-anim", !v);
        save(state);
      }),
    ]),
    el("h2", { class: "section-title", text: "Save data" }),
    el("button", { class: "btn-ghost settings-btn", text: "Export save", onclick: () => {
      navigator.clipboard?.writeText(exportSave(state)).then(
        () => showToast("Save copied to clipboard.", "success"),
        () => showToast("Copy failed — see console.", "error")
      ).catch(() => showToast("Copy failed.", "error"));
      showToast("Save copied to clipboard.", "success");
    } }),
    el("button", { class: "btn-ghost settings-btn", text: "Import save", onclick: () => promptImport() }),
    el("button", { class: "btn-ghost settings-btn btn-danger-text", text: "Reset progress", onclick: () => confirmReset() }),
    el("p", { class: "disclaimer", text: "PHARMA RUSH is an educational simulation. It is not a substitute for professional healthcare advice or clinical decision-making." }),
  ]));
}

function toggleRow(label, value, onChange) {
  return el("div", { class: "settings-row" }, [
    el("span", { class: "profile-label", text: label }),
    el("button", { class: value ? "btn-primary btn-small" : "btn-ghost btn-small", text: value ? "ON" : "OFF", onclick: () => { play("click"); onChange(!value); } }),
  ]);
}

function promptImport() {
  const text = window.prompt("Paste your save JSON below:");
  if (!text) return;
  try {
    const imported = importSave(text);
    const state = getState();
    Object.assign(state, imported);
    save(state);
    showToast("Save imported.", "success");
    showScreen("settings");
  } catch (err) {
    showToast(err.message, "error");
  }
}

function confirmReset() {
  const ok = window.confirm("Reset ALL progress? This cannot be undone.");
  if (!ok) return;
  const again = window.confirm("Are you really sure? Your pharmacy, levels, and cards will be wiped.");
  if (!again) return;
  reset();
  window.location.reload();
}
