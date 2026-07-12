<<<<<<< HEAD
-- TransitOps — Triggers and reporting views
-- These are the SECOND, defense-in-depth enforcement layer (per resolved diff #5).
-- Application services in backend/app/services/ are the primary enforcement point.

DELIMITER $$

-- Prevent inserting a trip that would double-book vehicle or driver.
=======
USE transitops;

DELIMITER $$

>>>>>>> e21946685e62ae18c3f3933d86dd20bdbac55cd8
CREATE TRIGGER trg_trip_before_insert
BEFORE INSERT ON trips
FOR EACH ROW
BEGIN
<<<<<<< HEAD
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
=======
    DECLARE v_status VARCHAR(20); DECLARE v_capacity DECIMAL(10,2);
    DECLARE d_status VARCHAR(20); DECLARE d_expiry DATE;

    SELECT status, max_load_capacity INTO v_status, v_capacity FROM vehicles WHERE vehicle_id = NEW.vehicle_id;
    SELECT status, license_expiry_date INTO d_status, d_expiry FROM drivers WHERE driver_id = NEW.driver_id;

    IF NEW.cargo_weight > v_capacity THEN
        SIGNAL SQLSTATE '45000' SET MESSAGE_TEXT = 'Cargo weight exceeds vehicle max load capacity';
    END IF;

    IF NEW.status = 'Dispatched' THEN
        IF v_status != 'Available' THEN
            SIGNAL SQLSTATE '45000' SET MESSAGE_TEXT = 'Vehicle is not Available for dispatch';
        END IF;
        IF d_status != 'Available' THEN
            SIGNAL SQLSTATE '45000' SET MESSAGE_TEXT = 'Driver is not Available';
        END IF;
        IF d_expiry < CURDATE() THEN
            SIGNAL SQLSTATE '45000' SET MESSAGE_TEXT = 'Driver license is expired';
        END IF;
    END IF;
END$$

>>>>>>> e21946685e62ae18c3f3933d86dd20bdbac55cd8
CREATE TRIGGER trg_trip_dispatch
AFTER UPDATE ON trips
FOR EACH ROW
BEGIN
<<<<<<< HEAD
  IF NEW.status = 'Dispatched' AND OLD.status = 'Draft' THEN
    UPDATE vehicles SET status = 'On Trip' WHERE id = NEW.vehicle_id;
    UPDATE drivers  SET status = 'On Trip' WHERE id = NEW.driver_id;
  ELSEIF NEW.status IN ('Completed','Cancelled') AND OLD.status = 'Dispatched' THEN
    UPDATE vehicles SET status = 'Available' WHERE id = NEW.vehicle_id;
    UPDATE drivers  SET status = 'Available' WHERE id = NEW.driver_id;
  END IF;
END$$

-- Opening a maintenance record moves vehicle to In Shop.
=======
    IF NEW.status = 'Dispatched' AND OLD.status = 'Draft' THEN
        UPDATE vehicles SET status = 'On Trip' WHERE vehicle_id = NEW.vehicle_id;
        UPDATE drivers SET status = 'On Trip' WHERE driver_id = NEW.driver_id;
        INSERT INTO vehicle_status_history (vehicle_id, old_status, new_status, reason)
            VALUES (NEW.vehicle_id, 'Available', 'On Trip', CONCAT('Trip ', NEW.trip_code, ' dispatched'));
        INSERT INTO driver_status_history (driver_id, old_status, new_status, reason)
            VALUES (NEW.driver_id, 'Available', 'On Trip', CONCAT('Trip ', NEW.trip_code, ' dispatched'));
    END IF;

    IF NEW.status = 'Completed' AND OLD.status = 'Dispatched' THEN
        UPDATE vehicles SET status = 'Available', odometer = COALESCE(NEW.final_odometer, odometer) WHERE vehicle_id = NEW.vehicle_id;
        UPDATE drivers SET status = 'Available' WHERE driver_id = NEW.driver_id;
        INSERT INTO vehicle_status_history (vehicle_id, old_status, new_status, reason)
            VALUES (NEW.vehicle_id, 'On Trip', 'Available', CONCAT('Trip ', NEW.trip_code, ' completed'));
        INSERT INTO driver_status_history (driver_id, old_status, new_status, reason)
            VALUES (NEW.driver_id, 'On Trip', 'Available', CONCAT('Trip ', NEW.trip_code, ' completed'));
    END IF;

    IF NEW.status = 'Cancelled' AND OLD.status = 'Dispatched' THEN
        UPDATE vehicles SET status = 'Available' WHERE vehicle_id = NEW.vehicle_id;
        UPDATE drivers SET status = 'Available' WHERE driver_id = NEW.driver_id;
        INSERT INTO vehicle_status_history (vehicle_id, old_status, new_status, reason)
            VALUES (NEW.vehicle_id, 'On Trip', 'Available', CONCAT('Trip ', NEW.trip_code, ' cancelled'));
        INSERT INTO driver_status_history (driver_id, old_status, new_status, reason)
            VALUES (NEW.driver_id, 'On Trip', 'Available', CONCAT('Trip ', NEW.trip_code, ' cancelled'));
    END IF;

    IF NEW.status != OLD.status THEN
        INSERT INTO trip_status_history (trip_id, old_status, new_status)
            VALUES (NEW.trip_id, OLD.status, NEW.status);
    END IF;
END$$

>>>>>>> e21946685e62ae18c3f3933d86dd20bdbac55cd8
CREATE TRIGGER trg_maintenance_open
AFTER INSERT ON maintenance_logs
FOR EACH ROW
BEGIN
<<<<<<< HEAD
  UPDATE vehicles SET status = 'In Shop' WHERE id = NEW.vehicle_id AND status = 'Available';
END$$

-- Closing a maintenance record returns vehicle to Available (unless retired).
=======
    IF NEW.status = 'Open' THEN
        UPDATE vehicles SET status = 'In Shop' WHERE vehicle_id = NEW.vehicle_id;
        INSERT INTO vehicle_status_history (vehicle_id, old_status, new_status, reason)
            VALUES (NEW.vehicle_id, 'Available', 'In Shop', 'Maintenance opened');
    END IF;
END$$

>>>>>>> e21946685e62ae18c3f3933d86dd20bdbac55cd8
CREATE TRIGGER trg_maintenance_close
AFTER UPDATE ON maintenance_logs
FOR EACH ROW
BEGIN
<<<<<<< HEAD
  IF NEW.status = 'Closed' AND OLD.status = 'Open' THEN
    UPDATE vehicles SET status = 'Available'
      WHERE id = NEW.vehicle_id AND status = 'In Shop';
  END IF;
=======
    DECLARE cur_status VARCHAR(20);
    IF NEW.status = 'Closed' AND OLD.status = 'Open' THEN
        SELECT status INTO cur_status FROM vehicles WHERE vehicle_id = NEW.vehicle_id;
        IF cur_status != 'Retired' THEN
            UPDATE vehicles SET status = 'Available' WHERE vehicle_id = NEW.vehicle_id;
            INSERT INTO vehicle_status_history (vehicle_id, old_status, new_status, reason)
                VALUES (NEW.vehicle_id, 'In Shop', 'Available', 'Maintenance closed');
        END IF;
    END IF;
>>>>>>> e21946685e62ae18c3f3933d86dd20bdbac55cd8
END$$

DELIMITER ;

<<<<<<< HEAD
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
=======
CREATE VIEW v_vehicle_operational_cost AS
SELECT v.vehicle_id, v.registration_number,
       COALESCE(f.total_fuel_cost, 0) AS total_fuel_cost,
       COALESCE(m.total_maintenance_cost, 0) AS total_maintenance_cost,
       COALESCE(f.total_fuel_cost, 0) + COALESCE(m.total_maintenance_cost, 0) AS total_operational_cost
FROM vehicles v
LEFT JOIN (SELECT vehicle_id, SUM(cost) AS total_fuel_cost FROM fuel_logs GROUP BY vehicle_id) f
    ON f.vehicle_id = v.vehicle_id
LEFT JOIN (SELECT vehicle_id, SUM(cost) AS total_maintenance_cost FROM maintenance_logs GROUP BY vehicle_id) m
    ON m.vehicle_id = v.vehicle_id;

CREATE VIEW v_fuel_efficiency AS
SELECT trip_id, vehicle_id, actual_distance, fuel_consumed,
       CASE WHEN fuel_consumed > 0 THEN actual_distance / fuel_consumed ELSE NULL END AS km_per_liter
FROM trips
WHERE status = 'Completed';

CREATE VIEW v_vehicle_roi AS
SELECT v.vehicle_id, v.registration_number, v.acquisition_cost,
       COALESCE(r.total_revenue, 0) AS total_revenue,
       oc.total_operational_cost,
       CASE WHEN v.acquisition_cost > 0
            THEN (COALESCE(r.total_revenue,0) - oc.total_operational_cost) / v.acquisition_cost
            ELSE NULL END AS roi
FROM vehicles v
JOIN v_vehicle_operational_cost oc ON oc.vehicle_id = v.vehicle_id
LEFT JOIN (SELECT vehicle_id, SUM(revenue) AS total_revenue FROM trips WHERE status='Completed' GROUP BY vehicle_id) r
    ON r.vehicle_id = v.vehicle_id;

CREATE VIEW v_fleet_utilization AS
SELECT
    (SELECT COUNT(*) FROM vehicles WHERE status = 'On Trip') AS vehicles_on_trip,
    (SELECT COUNT(*) FROM vehicles WHERE is_deleted = FALSE AND status != 'Retired') AS active_vehicles,
    ROUND(
      (SELECT COUNT(*) FROM vehicles WHERE status = 'On Trip') /
      NULLIF((SELECT COUNT(*) FROM vehicles WHERE is_deleted = FALSE AND status != 'Retired'), 0) * 100, 2
    ) AS utilization_pct;

CREATE VIEW v_dashboard_kpis AS
SELECT
    (SELECT COUNT(*) FROM vehicles WHERE is_deleted=FALSE AND status != 'Retired') AS active_vehicles,
    (SELECT COUNT(*) FROM vehicles WHERE status='Available') AS available_vehicles,
    (SELECT COUNT(*) FROM vehicles WHERE status='In Shop') AS vehicles_in_maintenance,
    (SELECT COUNT(*) FROM trips WHERE status='Dispatched') AS active_trips,
    (SELECT COUNT(*) FROM trips WHERE status='Draft') AS pending_trips,
    (SELECT COUNT(*) FROM drivers WHERE status='On Trip') AS drivers_on_duty,
    (SELECT utilization_pct FROM v_fleet_utilization) AS fleet_utilization_pct;
>>>>>>> e21946685e62ae18c3f3933d86dd20bdbac55cd8
