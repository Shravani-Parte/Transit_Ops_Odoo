-- TransitOps — Seed data
-- 4 roles per resolved diff #1 (mock's login screen).
-- No 5th "Admin" role; system config is role-scoped through role_permissions.

INSERT INTO roles (id, name, description) VALUES
  ('r-fm', 'FleetManager',    'Fleet Manager — vehicle lifecycle, maintenance oversight'),
  ('r-dp', 'Dispatcher',      'Dispatcher — trip creation and dispatch'),
  ('r-so', 'SafetyOfficer',   'Safety Officer — driver compliance and safety'),
  ('r-fa', 'FinancialAnalyst','Financial Analyst — cost, fuel, ROI reporting');

INSERT INTO permissions (id, module, action) VALUES
  ('p-veh-full', 'vehicles',   'full'),
  ('p-veh-view', 'vehicles',   'view'),
  ('p-drv-full', 'drivers',    'full'),
  ('p-drv-view', 'drivers',    'view'),
  ('p-trp-full', 'trips',      'full'),
  ('p-trp-view', 'trips',      'view'),
  ('p-mnt-full', 'maintenance','full'),
  ('p-fe-full',  'fuel_expense','full'),
  ('p-fe-view',  'fuel_expense','view'),
  ('p-rpt-full', 'reports',    'full'),
  ('p-rpt-view', 'reports',    'view'),
  ('p-set-view', 'settings',   'view');

-- Fleet Manager → Fleet: full, Drivers: full, Maintenance: full, Analytics: view
INSERT INTO role_permissions VALUES
  ('r-fm','p-veh-full'),('r-fm','p-drv-full'),('r-fm','p-mnt-full'),
  ('r-fm','p-rpt-view'),('r-fm','p-fe-view'),('r-fm','p-set-view');

-- Dispatcher → Fleet: view, Trips: full
INSERT INTO role_permissions VALUES
  ('r-dp','p-veh-view'),('r-dp','p-trp-full'),('r-dp','p-set-view');

-- Safety Officer → Drivers: full, Trips: view
INSERT INTO role_permissions VALUES
  ('r-so','p-drv-full'),('r-so','p-trp-view'),('r-so','p-set-view');

-- Financial Analyst → Fleet: view, Fuel/Exp: full, Analytics: full
INSERT INTO role_permissions VALUES
  ('r-fa','p-veh-view'),('r-fa','p-fe-full'),('r-fa','p-rpt-full'),('r-fa','p-set-view');

INSERT INTO regions (id, name) VALUES
  ('rg-south','South'),('rg-north','North'),('rg-west','West'),('rg-east','East');
