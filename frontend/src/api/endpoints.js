/** Endpoint URL registry — placeholder, mirrors backend/app/api/v1/router.py. */
const BASE = import.meta.env.VITE_API_BASE_URL || "/api/v1";
export const endpoints = {
  auth:          { login: `${BASE}/auth/login`, logout: `${BASE}/auth/logout`, me: `${BASE}/auth/me` },
  users:         `${BASE}/users`,
  roles:         `${BASE}/roles`,
  regions:       `${BASE}/regions`,
  dashboardKpis: `${BASE}/dashboard/kpis`,
  vehicles:      `${BASE}/vehicles`,
  drivers:       `${BASE}/drivers`,
  trips:         `${BASE}/trips`,
  maintenance:   `${BASE}/maintenance`,
  fuelLogs:      `${BASE}/fuel-logs`,
  expenses:      `${BASE}/expenses`,
  reports:       `${BASE}/reports`,
  exports:       `${BASE}/export`,
  notifications: `${BASE}/notifications`,
};
