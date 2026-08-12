import { el } from "../dom.js";

let host = null;

export function showToast(message, kind = "info") {
  if (!host) {
    host = el("div", { class: "toast-host" });
    document.body.append(host);
  }
  const toast = el("div", { class: `toast toast-${kind}`, text: message });
  host.append(toast);
  setTimeout(() => toast.remove(), 2200);
}