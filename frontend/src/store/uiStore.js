/** Global UI state (sidebar collapsed, theme, toasts) via a tiny event bus. */
const UI_KEY = "transitops.ui.v1";

export function getUi() {
  try { return JSON.parse(localStorage.getItem(UI_KEY) || "null") || { sidebarCollapsed: false, theme: "light" }; }
  catch { return { sidebarCollapsed: false, theme: "light" }; }
}

export function setUi(patch) {
  const next = { ...getUi(), ...patch };
  localStorage.setItem(UI_KEY, JSON.stringify(next));
  return next;
}
