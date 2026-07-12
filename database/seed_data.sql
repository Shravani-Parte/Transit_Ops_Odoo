USE transitops;

-- Roles
INSERT INTO roles (role_name, description) VALUES
('Fleet Manager', 'Oversees fleet assets, maintenance, vehicle lifecycle, and operational efficiency'),
('Dispatcher', 'Creates trips, assigns vehicles and drivers, monitors active deliveries'),
('Safety Officer', 'Ensures driver compliance, tracks license validity, monitors safety scores'),
('Financial Analyst', 'Reviews operational expenses, fuel consumption, maintenance costs, and profitability');

-- Permissions
INSERT INTO permissions (module, action) VALUES
('vehicle', 'create'), ('vehicle', 'read'), ('vehicle', 'update'), ('vehicle', 'delete'),
('driver', 'create'), ('driver', 'read'), ('driver', 'update'), ('driver', 'delete'),
('trip', 'create'), ('trip', 'read'), ('trip', 'update'), ('trip', 'delete'),
('maintenance', 'create'), ('maintenance', 'read'), ('maintenance', 'update'), ('maintenance', 'delete'),
('fuel_expense', 'create'), ('fuel_expense', 'read'), ('fuel_expense', 'update'), ('fuel_expense', 'delete'),
('reports', 'read'), ('reports', 'export'),
('dashboard', 'read'),
('settings', 'read'), ('settings', 'update'),
('notifications', 'read');

-- Fleet Manager: full access
INSERT INTO role_permissions (role_id, permission_id)
SELECT 1, permission_id FROM permissions;

-- Dispatcher: vehicle read, trip full, dashboard read
INSERT INTO role_permissions (role_id, permission_id)
SELECT 2, permission_id FROM permissions WHERE
    (module = 'vehicle' AND action = 'read') OR
    (module = 'driver' AND action = 'read') OR
    (module = 'trip') OR
    (module = 'dashboard' AND action = 'read') OR
    (module = 'fuel_expense' AND action = 'create') OR
    (module = 'notifications' AND action = 'read');

-- Safety Officer: driver full, trip read, dashboard read
INSERT INTO role_permissions (role_id, permission_id)
SELECT 3, permission_id FROM permissions WHERE
    (module = 'driver') OR
    (module = 'trip' AND action = 'read') OR
    (module = 'dashboard' AND action = 'read') OR
    (module = 'notifications' AND action = 'read');

-- Financial Analyst: vehicle read, fuel_expense full, reports full, dashboard read
INSERT INTO role_permissions (role_id, permission_id)
SELECT 4, permission_id FROM permissions WHERE
    (module = 'vehicle' AND action = 'read') OR
    (module = 'maintenance' AND action = 'read') OR
    (module = 'trip' AND action = 'read') OR
    (module = 'fuel_expense') OR
    (module = 'reports') OR
    (module = 'dashboard' AND action = 'read') OR
    (module = 'notifications' AND action = 'read');

-- Regions
INSERT INTO regions (region_name) VALUES
('North Zone'), ('South Zone'), ('East Zone'), ('West Zone'), ('Central Zone');

-- Org settings
INSERT INTO org_settings (depot_name, currency, distance_unit) VALUES
('TransitOps Central Depot', 'INR', 'km');

-- Demo users (password: password123)
-- bcrypt hash for 'password123'
INSERT INTO users (full_name, email, password_hash, role_id) VALUES
('Rajesh Kumar', 'fleet@transitops.com', '$2b$12$LQv3c1yqBWVHxkd0LHAkCOYz6TtxMQJqhN8/LewY5GyYqJqZqZqZq', 1),
('Priya Sharma', 'dispatcher@transitops.com', '$2b$12$LQv3c1yqBWVHxkd0LHAkCOYz6TtxMQJqhN8/LewY5GyYqJqZqZqZq', 2),
('Amit Patel', 'safety@transitops.com', '$2b$12$LQv3c1yqBWVHxkd0LHAkCOYz6TtxMQJqhN8/LewY5GyYqJqZqZqZq', 3),
('Sneha Reddy', 'finance@transitops.com', '$2b$12$LQv3c1yqBWVHxkd0LHAkCOYz6TtxMQJqhN8/LewY5GyYqJqZqZqZq', 4);

-- Demo vehicles
INSERT INTO vehicles (registration_number, vehicle_name, vehicle_type, max_load_capacity, odometer, acquisition_cost, region_id, status) VALUES
('MH-12-AB-1234', 'Van-05', 'Van', 500.00, 45230.00, 850000.00, 1, 'Available'),
('MH-12-CD-5678', 'Truck-12', 'Truck', 2000.00, 128500.00, 2500000.00, 2, 'Available'),
('MH-12-EF-9012', 'Van-08', 'Van', 750.00, 32100.00, 920000.00, 3, 'Available'),
('MH-12-GH-3456', 'Trailer-03', 'Trailer', 5000.00, 89000.00, 1800000.00, 4, 'In Shop'),
('MH-12-IJ-7890', 'Van-02', 'Van', 400.00, 67800.00, 720000.00, 5, 'Available');

-- Demo drivers
INSERT INTO drivers (full_name, license_number, license_category, license_expiry_date, contact_number, safety_score, status) VALUES
('Alex Johnson', 'DL-MH-2019-001234', 'LMV', '2027-06-15', '+91-9876543210', 95.50, 'Available'),
('Maria Garcia', 'DL-MH-2020-005678', 'HMV', '2026-12-20', '+91-9876543211', 88.00, 'Available'),
('John Smith', 'DL-MH-2018-009012', 'LMV', '2025-03-10', '+91-9876543212', 72.50, 'Available'),
('Sarah Wilson', 'DL-MH-2021-003456', 'HMV', '2028-08-25', '+91-9876543213', 91.00, 'Off Duty'),
('David Brown', 'DL-MH-2017-007890', 'LMV', '2024-01-05', '+91-9876543214', 45.00, 'Suspended');

-- Demo maintenance (Trailer-03 in shop)
INSERT INTO maintenance_logs (vehicle_id, maintenance_type, description, cost, status, created_by) VALUES
(4, 'Brake System Repair', 'Full brake pad replacement and fluid change', 15000.00, 'Open', 1);

-- Demo trips
INSERT INTO trips (trip_code, source, destination, vehicle_id, driver_id, cargo_weight, planned_distance, revenue, status, created_by) VALUES
('TRIP-000001', 'Mumbai Warehouse', 'Pune Distribution Center', 1, 1, 450.00, 150.00, 25000.00, 'Draft', 2),
('TRIP-000002', 'Delhi Hub', 'Jaipur Depot', 2, 2, 1800.00, 280.00, 85000.00, 'Completed', 2);

UPDATE trips SET status='Completed', actual_distance=275.00, starting_odometer=128000, final_odometer=128275,
    fuel_consumed=85.00, dispatched_at='2026-03-01 08:00:00', completed_at='2026-03-01 16:30:00'
WHERE trip_code='TRIP-000002';

-- Fuel logs
INSERT INTO fuel_logs (vehicle_id, trip_id, liters, cost, log_date, recorded_by) VALUES
(2, 2, 85.00, 7650.00, '2026-03-01', 4);

-- Expenses
INSERT INTO expenses (vehicle_id, trip_id, expense_type, amount, expense_date, description, recorded_by) VALUES
(2, 2, 'Toll', 1200.00, '2026-03-01', 'Highway toll charges', 4);
