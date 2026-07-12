/** Minimal auth store — role-selected demo login, localStorage-backed. */
const AUTH_KEY = "transitops.auth.v1";

export function getAuth() {
  try { return JSON.parse(localStorage.getItem(AUTH_KEY) || "null"); } catch { return null; }
}

export function setAuth(user) {
  localStorage.setItem(AUTH_KEY, JSON.stringify(user));
}

export function clearAuth() {
  localStorage.removeItem(AUTH_KEY);
}
