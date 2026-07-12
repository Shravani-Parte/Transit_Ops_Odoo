/**
 * Data-driven RBAC map — mirrors role_permissions table (diff #3).
 * Keyed by role name. Each entry: { module: 'full' | 'view' | 'none' }.
 * "full" = create/update/delete; "view" = read-only; missing = no access.
 */
export const ROLE_PERMISSIONS = {
  FleetManager: {
    dashboard: "full",
    vehicles: "full",
    drivers: "full",
    trips: "view",
    maintenance: "full",
    fuel_expense: "view",
    reports: "view",
    settings: "view",
  },
  Dispatcher: {
    dashboard: "view",
    vehicles: "view",
    trips: "full",
    maintenance: "view",
    settings: "view",
  },
  SafetyOfficer: {
    dashboard: "view",
    drivers: "full",
    trips: "view",
    reports: "view",
    settings: "view",
  },
  FinancialAnalyst: {
    dashboard: "view",
    vehicles: "view",
    drivers: "view",
    fuel_expense: "full",
    maintenance: "view",
    reports: "full",
    settings: "view",
  },
};

export function can(role, module, action = "view") {
  const perm = ROLE_PERMISSIONS[role]?.[module];
  if (!perm) return false;
  if (action === "view") return perm === "view" || perm === "full";
  return perm === "full";
}

export const NAV_MODULE_MAP = {
  "/dashboard": "dashboard",
  "/fleet": "vehicles",
  "/drivers": "drivers",
  "/trips": "trips",
  "/maintenance": "maintenance",
  "/fuel": "fuel_expense",
  "/expenses": "fuel_expense",
  "/analytics": "reports",
  "/settings": "settings",
};
