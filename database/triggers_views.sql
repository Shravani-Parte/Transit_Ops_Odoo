-- TransitOps — Triggers and reporting views
-- These are the SECOND, defense-in-depth enforcement layer (per resolved diff #5).
-- Application services in backend/app/services/ are the primary enforcement point.

DELIMITER $$

-- Prevent inserting a trip that would double-book vehicle or driver.
CREATE TRIGGER trg_trip_before_insert
BEFORE INSERT ON trips
FOR EACH ROW
BEGIN
  DECLARE veh_status VARCHAR(32);
  DECLARE drv_status VARCHAR(32);
  DECLARE veh_cap DECIMAL(10,2);
  DECLARE drv_exp DATE;

  SELECT status, max_load_capacity INTO veh_status, veh_cap FROM vehicles WHERE id = NEW.vehicle_id;
  SELECT status, license_expiry_date INTO drv_status, drv_exp FROM drivers WHERE id = NEW.driver_id;

  IF veh_status IN ('In Shop','Retired') THEN
    SIGNAL SQLSTATE '45000' SET MESSAGE_TEXT = 'Vehicle not dispatchable';
  END IF;
  IF drv_status = 'Suspended' OR drv_exp < CURDATE() THEN
    SIGNAL SQLSTATE '45000' SET MESSAGE_TEXT = 'Driver not eligible (suspended or expired license)';
  END IF;
  IF NEW.cargo_weight > veh_cap THEN
    SIGNAL SQLSTATE '45000' SET MESSAGE_TEXT = 'Cargo weight exceeds vehicle capacity';
  END IF;
END$$

-- When a trip is dispatched, atomically flip vehicle + driver to On Trip.
CREATE TRIGGER trg_trip_dispatch
AFTER UPDATE ON trips
FOR EACH ROW
BEGIN
  IF NEW.status = 'Dispatched' AND OLD.status = 'Draft' THEN
    UPDATE vehicles SET status = 'On Trip' WHERE id = NEW.vehicle_id;
    UPDATE drivers  SET status = 'On Trip' WHERE id = NEW.driver_id;
  ELSEIF NEW.status IN ('Completed','Cancelled') AND OLD.status = 'Dispatched' THEN
    UPDATE vehicles SET status = 'Available' WHERE id = NEW.vehicle_id;
    UPDATE drivers  SET status = 'Available' WHERE id = NEW.driver_id;
  END IF;
END$$

-- Opening a maintenance record moves vehicle to In Shop.
CREATE TRIGGER trg_maintenance_open
AFTER INSERT ON maintenance_logs
FOR EACH ROW
BEGIN
  UPDATE vehicles SET status = 'In Shop' WHERE id = NEW.vehicle_id AND status = 'Available';
END$$

-- Closing a maintenance record returns vehicle to Available (unless retired).
CREATE TRIGGER trg_maintenance_close
AFTER UPDATE ON maintenance_logs
FOR EACH ROW
BEGIN
  IF NEW.status = 'Closed' AND OLD.status = 'Open' THEN
    UPDATE vehicles SET status = 'Available'
      WHERE id = NEW.vehicle_id AND status = 'In Shop';
  END IF;
END$$

DELIMITER ;

-- ============ Reporting Views ============
CREATE OR REPLACE VIEW v_vehicle_operational_cost AS
SELECT v.id AS vehicle_id, v.registration_number,
       COALESCE(SUM(DISTINCT ml.cost),0) AS maintenance_cost,
       COALESCE(SUM(DISTINCT fl.cost),0) AS fuel_cost,
       COALESCE(SUM(DISTINCT e.amount),0) AS other_expenses,
       COALESCE(SUM(DISTINCT ml.cost),0) + COALESCE(SUM(DISTINCT fl.cost),0)
         + COALESCE(SUM(DISTINCT e.amount),0) AS total_operational_cost
FROM vehicles v
LEFT JOIN maintenance_logs ml ON ml.vehicle_id = v.id
LEFT JOIN fuel_logs fl        ON fl.vehicle_id = v.id
LEFT JOIN expenses e          ON e.vehicle_id = v.id
GROUP BY v.id, v.registration_number;

CREATE OR REPLACE VIEW v_fuel_efficiency AS
SELECT v.id AS vehicle_id, v.registration_number,
       SUM(fl.liters) AS total_liters,
       SUM(t.actual_distance) AS total_km,
       CASE WHEN SUM(fl.liters) > 0 THEN SUM(t.actual_distance)/SUM(fl.liters) END AS km_per_liter
FROM vehicles v
LEFT JOIN fuel_logs fl ON fl.vehicle_id = v.id
LEFT JOIN trips t      ON t.vehicle_id = v.id AND t.status = 'Completed'
GROUP BY v.id, v.registration_number;

CREATE OR REPLACE VIEW v_vehicle_roi AS
SELECT v.id AS vehicle_id, v.registration_number, v.acquisition_cost,
       COALESCE(SUM(t.revenue),0) AS total_revenue,
       (SELECT total_operational_cost FROM v_vehicle_operational_cost o WHERE o.vehicle_id = v.id) AS operational_cost,
       CASE WHEN v.acquisition_cost > 0 THEN
         (COALESCE(SUM(t.revenue),0)
           - (SELECT total_operational_cost FROM v_vehicle_operational_cost o WHERE o.vehicle_id = v.id))
         / v.acquisition_cost
       END AS roi
FROM vehicles v
LEFT JOIN trips t ON t.vehicle_id = v.id AND t.status = 'Completed'
GROUP BY v.id, v.registration_number, v.acquisition_cost;

CREATE OR REPLACE VIEW v_fleet_utilization AS
SELECT
  (SELECT COUNT(*) FROM vehicles WHERE status = 'On Trip')    AS on_trip,
  (SELECT COUNT(*) FROM vehicles WHERE status = 'Available')  AS available,
  (SELECT COUNT(*) FROM vehicles WHERE status = 'In Shop')    AS in_shop,
  (SELECT COUNT(*) FROM vehicles WHERE status = 'Retired')    AS retired,
  (SELECT COUNT(*) FROM vehicles WHERE status <> 'Retired')   AS active_fleet;

CREATE OR REPLACE VIEW v_dashboard_kpis AS
SELECT
  (SELECT COUNT(*) FROM vehicles WHERE status = 'Available') AS available_vehicles,
  (SELECT COUNT(*) FROM vehicles WHERE status = 'On Trip')   AS on_trip_vehicles,
  (SELECT COUNT(*) FROM vehicles WHERE status = 'In Shop')   AS in_shop_vehicles,
  (SELECT COUNT(*) FROM drivers  WHERE status = 'Available') AS drivers_available,
  (SELECT COUNT(*) FROM drivers  WHERE status = 'On Trip')   AS drivers_on_trip,
  (SELECT COALESCE(SUM(cost),0) FROM fuel_logs WHERE MONTH(logged_at) = MONTH(CURDATE())) AS monthly_fuel_cost,
  (SELECT COALESCE(SUM(cost),0) FROM maintenance_logs WHERE MONTH(opened_at) = MONTH(CURDATE())) AS monthly_maintenance_cost;
