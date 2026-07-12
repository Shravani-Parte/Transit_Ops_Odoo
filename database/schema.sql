-- TransitOps — Reference schema (MySQL 8.0)
-- Runtime source of truth for migrations is Alembic (backend/alembic/).
-- This file is a point-in-time snapshot for quick setup / demo clarity.

SET FOREIGN_KEY_CHECKS = 0;

CREATE TABLE roles (
  id            CHAR(36) PRIMARY KEY,
  name          VARCHAR(64) NOT NULL UNIQUE,
  description   VARCHAR(255)
);

CREATE TABLE permissions (
  id            CHAR(36) PRIMARY KEY,
  module        VARCHAR(64) NOT NULL,
  action        VARCHAR(64) NOT NULL,
  description   VARCHAR(255),
  UNIQUE KEY uq_module_action (module, action)
);

CREATE TABLE role_permissions (
  role_id       CHAR(36) NOT NULL,
  permission_id CHAR(36) NOT NULL,
  PRIMARY KEY (role_id, permission_id),
  FOREIGN KEY (role_id) REFERENCES roles(id) ON DELETE CASCADE,
  FOREIGN KEY (permission_id) REFERENCES permissions(id) ON DELETE CASCADE
);

CREATE TABLE regions (
  id            CHAR(36) PRIMARY KEY,
  name          VARCHAR(64) NOT NULL UNIQUE
);

CREATE TABLE users (
  id            CHAR(36) PRIMARY KEY,
  name          VARCHAR(128) NOT NULL,
  email         VARCHAR(191) NOT NULL UNIQUE,
  password_hash VARCHAR(255) NOT NULL,
  role_id       CHAR(36) NOT NULL,
  status        ENUM('Active','Disabled') NOT NULL DEFAULT 'Active',
  created_at    TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at    TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (role_id) REFERENCES roles(id)
);

CREATE TABLE vehicles (
  id                  CHAR(36) PRIMARY KEY,
  registration_number VARCHAR(32) NOT NULL UNIQUE,
  name_model          VARCHAR(128) NOT NULL,
  type                VARCHAR(64) NOT NULL,
  max_load_capacity   DECIMAL(10,2) NOT NULL,
  odometer            DECIMAL(12,2) NOT NULL DEFAULT 0,
  acquisition_cost    DECIMAL(12,2) NOT NULL DEFAULT 0,
  status              ENUM('Available','On Trip','In Shop','Retired') NOT NULL DEFAULT 'Available',
  region_id           CHAR(36),
  created_at          TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at          TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  INDEX idx_status (status),
  FOREIGN KEY (region_id) REFERENCES regions(id)
);

CREATE TABLE vehicle_status_history (
  id          CHAR(36) PRIMARY KEY,
  vehicle_id  CHAR(36) NOT NULL,
  from_status VARCHAR(32),
  to_status   VARCHAR(32) NOT NULL,
  reason      VARCHAR(255),
  changed_by  CHAR(36),
  changed_at  TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (vehicle_id) REFERENCES vehicles(id) ON DELETE CASCADE
);

CREATE TABLE vehicle_documents (
  id          CHAR(36) PRIMARY KEY,
  vehicle_id  CHAR(36) NOT NULL,
  doc_type    VARCHAR(64) NOT NULL,
  file_url    VARCHAR(512),
  expires_on  DATE,
  uploaded_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (vehicle_id) REFERENCES vehicles(id) ON DELETE CASCADE
);

CREATE TABLE drivers (
  id                  CHAR(36) PRIMARY KEY,
  name                VARCHAR(128) NOT NULL,
  license_number      VARCHAR(64) NOT NULL UNIQUE,
  license_category    VARCHAR(32) NOT NULL,
  license_expiry_date DATE NOT NULL,
  contact_number      VARCHAR(32),
  safety_score        DECIMAL(5,2) NOT NULL DEFAULT 100,
  status              ENUM('Available','On Trip','Off Duty','Suspended') NOT NULL DEFAULT 'Available',
  user_id             CHAR(36),
  created_at          TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at          TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  INDEX idx_status (status),
  FOREIGN KEY (user_id) REFERENCES users(id)
);

CREATE TABLE driver_status_history (
  id          CHAR(36) PRIMARY KEY,
  driver_id   CHAR(36) NOT NULL,
  from_status VARCHAR(32),
  to_status   VARCHAR(32) NOT NULL,
  reason      VARCHAR(255),
  changed_by  CHAR(36),
  changed_at  TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (driver_id) REFERENCES drivers(id) ON DELETE CASCADE
);

CREATE TABLE trips (
  id                CHAR(36) PRIMARY KEY,
  source            VARCHAR(128) NOT NULL,
  destination       VARCHAR(128) NOT NULL,
  vehicle_id        CHAR(36) NOT NULL,
  driver_id         CHAR(36) NOT NULL,
  cargo_weight      DECIMAL(10,2) NOT NULL,
  planned_distance  DECIMAL(10,2) NOT NULL,
  actual_distance   DECIMAL(10,2),
  revenue           DECIMAL(12,2) NOT NULL DEFAULT 0,
  status            ENUM('Draft','Dispatched','Completed','Cancelled') NOT NULL DEFAULT 'Draft',
  dispatched_at     TIMESTAMP NULL,
  completed_at      TIMESTAMP NULL,
  created_at        TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at        TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (vehicle_id) REFERENCES vehicles(id),
  FOREIGN KEY (driver_id) REFERENCES drivers(id)
);

CREATE TABLE trip_status_history (
  id          CHAR(36) PRIMARY KEY,
  trip_id     CHAR(36) NOT NULL,
  from_status VARCHAR(32),
  to_status   VARCHAR(32) NOT NULL,
  reason      VARCHAR(255),
  changed_by  CHAR(36),
  changed_at  TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (trip_id) REFERENCES trips(id) ON DELETE CASCADE
);

CREATE TABLE maintenance_logs (
  id           CHAR(36) PRIMARY KEY,
  vehicle_id   CHAR(36) NOT NULL,
  opened_at    TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  closed_at    TIMESTAMP NULL,
  category     VARCHAR(64) NOT NULL,
  description  TEXT,
  cost         DECIMAL(12,2) NOT NULL DEFAULT 0,
  status       ENUM('Open','Closed') NOT NULL DEFAULT 'Open',
  FOREIGN KEY (vehicle_id) REFERENCES vehicles(id) ON DELETE CASCADE
);

CREATE TABLE fuel_logs (
  id          CHAR(36) PRIMARY KEY,
  vehicle_id  CHAR(36) NOT NULL,
  trip_id     CHAR(36),
  liters      DECIMAL(8,2) NOT NULL,
  cost        DECIMAL(12,2) NOT NULL,
  odometer    DECIMAL(12,2),
  logged_at   TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (vehicle_id) REFERENCES vehicles(id),
  FOREIGN KEY (trip_id) REFERENCES trips(id)
);

CREATE TABLE expenses (
  id          CHAR(36) PRIMARY KEY,
  vehicle_id  CHAR(36),
  trip_id     CHAR(36),
  category    VARCHAR(64) NOT NULL,
  amount      DECIMAL(12,2) NOT NULL,
  notes       VARCHAR(500),
  incurred_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (vehicle_id) REFERENCES vehicles(id),
  FOREIGN KEY (trip_id) REFERENCES trips(id)
);

CREATE TABLE notifications (
  id          CHAR(36) PRIMARY KEY,
  user_id     CHAR(36),
  kind        VARCHAR(64) NOT NULL,
  payload     JSON,
  read_at     TIMESTAMP NULL,
  created_at  TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

SET FOREIGN_KEY_CHECKS = 1;
