import { el } from "../dom.js";
import { getState } from "../../core/state.js";
import { showScreen } from "../../core/router.js";
import { renderStatBar } from "../components/statBar.js";
import { customerCard } from "../components/customerCard.js";
import { showToast } from "../components/toast.js";
import { play } from "../../audio/sound.js";
import { createQueue, nextCustomer, fillQueue } from "../../game/queue.js";
import { isBossUnlocked } from "../../game/boss.js";
import { startCase } from "./case.js";

const queue = createQueue();

export function render(container) {
  const state = getState();
  const boss = isBossUnlocked(state);

  container.append(
    el("div", { class: "screen pharmacy" }, [
      el("div", { class: "pharmacy-top" }, [
        el("button", { class: "btn-icon", text: "‹", "aria-label": "Back to menu", onclick: () => { play("click"); showScreen("menu"); } }),
        el("h1", { class: "screen-title", text: "Your Pharmacy" }),
      ]),
      renderStatBar(state),
      pharmacyScene(),
      el("h2", { class: "section-title", text: "Waiting customers" }),
      queueSection(),
      el("button", { class: "btn-primary serve-btn", text: "Serve next customer", onclick: serveNext }),
      boss ? el("button", { class: "btn-primary boss-btn", text: "⚑ Clinical Boss Case", onclick: () => { play("click"); startCase("boss"); } }) : null,
      navRow(),
    ])
  );
}

function pharmacyScene() {
  return el("div", { class: "pharmacy-scene" }, [
    el("div", { class: "scene-shelf", html: shelfSvg() }),
    el("div", { class: "scene-counter", html: counterSvg() }),
    el("div", { class: "scene-floor" }),
  ]);
}

function queueSection() {
  const list = el("div", { class: "queue-list" });
  for (const customer of queue) list.append(customerCard(customer));
  return list;
}

function serveNext() {
  const customer = nextCustomer(queue);
  fillQueue(queue);
  play("click");
  if (customer) showToast(`Serving ${customer.name}.`, "info");
  startCase("sim");
}

function navRow() {
  const items = [
    ["Inventory", "inventory"],
    ["Upgrades", "upgrades"],
    ["Achievements", "achievements"],
    ["Profile", "profile"],
  ];
  return el("div", { class: "nav-row" }, items.map(([label, screen]) =>
    el("button", { class: "btn-ghost btn-small", text: label, onclick: () => { play("click"); showScreen(screen); } })
  ));
}

function shelfSvg() {
  return `<svg viewBox="0 0 120 80" width="120" height="80" aria-hidden="true">
    <rect x="5" y="5" width="110" height="70" rx="6" fill="#e6d5b8"/>
    <rect x="5" y="30" width="110" height="4" fill="#c9b28d"/>
    <rect x="5" y="52" width="110" height="4" fill="#c9b28d"/>
    <rect x="14" y="12" width="18" height="16" rx="3" fill="#0b7a6f"/>
    <rect x="38" y="12" width="18" height="16" rx="3" fill="#27ae60"/>
    <rect x="62" y="12" width="18" height="16" rx="3" fill="#0b7a6f"/>
    <rect x="14" y="36" width="18" height="14" rx="3" fill="#e67e22"/>
    <rect x="38" y="36" width="18" height="14" rx="3" fill="#0b7a6f"/>
    <rect x="62" y="36" width="18" height="14" rx="3" fill="#f5b301"/>
  </svg>`;
}

function counterSvg() {
  return `<svg viewBox="0 0 120 80" width="120" height="80" aria-hidden="true">
    <rect x="10" y="30" width="100" height="30" rx="4" fill="#0b7a6f"/>
    <rect x="10" y="30" width="100" height="8" rx="4" fill="#0d8a7c"/>
    <rect x="22" y="46" width="76" height="14" rx="3" fill="#085e56"/>
    <circle cx="42" cy="53" r="4" fill="#ffffff"/>
  </svg>`;
}
