import { el } from "../dom.js";

export function customerCard(customer) {
  return el("div", { class: "customer-card" }, [
    el("div", { class: "customer-avatar", html: personSvg() }),
    el("div", { class: "customer-info" }, [
      el("div", { class: "customer-name", text: customer.name }),
      el("div", { class: "customer-complaint", text: customer.complaint }),
    ]),
  ]);
}

function personSvg() {
  return `<svg viewBox="0 0 48 48" width="40" height="40" aria-hidden="true">
    <circle cx="24" cy="16" r="9" fill="#9fd8cf"/>
    <path d="M7 46 a17 17 0 0 1 34 0 z" fill="#9fd8cf"/>
  </svg>`;
}