<<<<<<< HEAD
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
=======
const NAV_ITEMS = [
  { key: 'dashboard', label: 'Dashboard', path: '/dashboard', module: 'dashboard', action: 'read', icon: 'LayoutDashboard' },
  { key: 'fleet', label: 'Vehicles', path: '/vehicles', module: 'vehicle', action: 'read', icon: 'Truck' },
  { key: 'drivers', label: 'Drivers', path: '/drivers', module: 'driver', action: 'read', icon: 'Users' },
  { key: 'trips', label: 'Trips', path: '/trips', module: 'trip', action: 'read', icon: 'Route' },
  { key: 'maintenance', label: 'Maintenance', path: '/maintenance', module: 'maintenance', action: 'read', icon: 'Wrench' },
  { key: 'fuel', label: 'Fuel & Expenses', path: '/fuel-expenses', module: 'fuel_expense', action: 'read', icon: 'Fuel' },
  { key: 'analytics', label: 'Analytics', path: '/analytics', module: 'reports', action: 'read', icon: 'BarChart3' },
  { key: 'settings', label: 'Settings', path: '/settings', module: 'settings', action: 'read', icon: 'Settings' },
];

export function hasPermission(user, module, action) {
  if (!user?.permissions) return false;
  return user.permissions.some((p) => p.module === module && p.action === action);
}

export function getNavItems(user) {
  return NAV_ITEMS.filter((item) => hasPermission(user, item.module, item.action));
}

export function canCreate(user, module) {
  return hasPermission(user, module, 'create');
}

export function canUpdate(user, module) {
  return hasPermission(user, module, 'update');
}

export function canDelete(user, module) {
  return hasPermission(user, module, 'delete');
}

export function canExport(user) {
  return hasPermission(user, 'reports', 'export');
}
>>>>>>> e21946685e62ae18c3f3933d86dd20bdbac55cd8
