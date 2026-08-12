const screens = new Map();
let container = null;
let current = null;

export function initRouter(containerEl) {
  container = containerEl;
}

export function registerScreen(name, screen) {
  screens.set(name, screen);
}

export function showScreen(name) {
  if (!screens.has(name)) {
    throw new Error(`Unknown screen: "${name}"`);
  }
  if (current && typeof current.unmount === "function") {
    current.unmount();
  }
  container.innerHTML = "";
  const screen = screens.get(name);
  if (typeof screen.render === "function") {
    screen.render(container);
  }
  current = screen;
  document.documentElement.dataset.screen = name;
}
