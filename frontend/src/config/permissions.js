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
