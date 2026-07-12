CREATE DATABASE IF NOT EXISTS transitops CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
USE transitops;

CREATE TABLE roles (
    role_id         INT AUTO_INCREMENT PRIMARY KEY,
    role_name       VARCHAR(50) NOT NULL UNIQUE,
    description     VARCHAR(255),
    created_at      TIMESTAMP DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB;

CREATE TABLE permissions (
    permission_id   INT AUTO_INCREMENT PRIMARY KEY,
    module          VARCHAR(50) NOT NULL,
    action          VARCHAR(20) NOT NULL,
    UNIQUE KEY uq_module_action (module, action)
) ENGINE=InnoDB;

CREATE TABLE role_permissions (
    role_id         INT NOT NULL,
    permission_id   INT NOT NULL,
    PRIMARY KEY (role_id, permission_id),
    FOREIGN KEY (role_id) REFERENCES roles(role_id) ON DELETE CASCADE,
    FOREIGN KEY (permission_id) REFERENCES permissions(permission_id) ON DELETE CASCADE
) ENGINE=InnoDB;

CREATE TABLE users (
    user_id         INT AUTO_INCREMENT PRIMARY KEY,
    full_name       VARCHAR(100) NOT NULL,
    email           VARCHAR(150) NOT NULL UNIQUE,
    password_hash   VARCHAR(255) NOT NULL,
    role_id         INT NOT NULL,
    is_active       BOOLEAN DEFAULT TRUE,
    last_login_at   TIMESTAMP NULL,
    created_at      TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at      TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (role_id) REFERENCES roles(role_id),
    INDEX idx_users_role (role_id)
) ENGINE=InnoDB;

CREATE TABLE regions (
    region_id       INT AUTO_INCREMENT PRIMARY KEY,
    region_name     VARCHAR(100) NOT NULL UNIQUE
) ENGINE=InnoDB;

CREATE TABLE vehicles (
    vehicle_id          INT AUTO_INCREMENT PRIMARY KEY,
    registration_number VARCHAR(30) NOT NULL UNIQUE,
    vehicle_name        VARCHAR(100) NOT NULL,
    vehicle_type        VARCHAR(50) NOT NULL,
    max_load_capacity   DECIMAL(10,2) NOT NULL,
    odometer            DECIMAL(12,2) NOT NULL DEFAULT 0,
    acquisition_cost    DECIMAL(14,2) NOT NULL,
    region_id           INT,
    status              ENUM('Available','On Trip','In Shop','Retired') NOT NULL DEFAULT 'Available',
    is_deleted          BOOLEAN DEFAULT FALSE,
    created_at          TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at          TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (region_id) REFERENCES regions(region_id),
    INDEX idx_vehicle_status (status),
    INDEX idx_vehicle_type (vehicle_type),
    INDEX idx_vehicle_region (region_id)
) ENGINE=InnoDB;

CREATE TABLE vehicle_status_history (
    history_id      BIGINT AUTO_INCREMENT PRIMARY KEY,
    vehicle_id      INT NOT NULL,
    old_status      ENUM('Available','On Trip','In Shop','Retired'),
    new_status      ENUM('Available','On Trip','In Shop','Retired') NOT NULL,
    changed_by      INT,
    reason          VARCHAR(255),
    changed_at      TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (vehicle_id) REFERENCES vehicles(vehicle_id) ON DELETE CASCADE,
    FOREIGN KEY (changed_by) REFERENCES users(user_id),
    INDEX idx_vsh_vehicle_time (vehicle_id, changed_at)
) ENGINE=InnoDB;

CREATE TABLE vehicle_documents (
    document_id     INT AUTO_INCREMENT PRIMARY KEY,
    vehicle_id      INT NOT NULL,
    document_type   VARCHAR(50) NOT NULL,
    file_url        VARCHAR(500) NOT NULL,
    expiry_date     DATE,
    uploaded_by     INT,
    uploaded_at     TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (vehicle_id) REFERENCES vehicles(vehicle_id) ON DELETE CASCADE,
    FOREIGN KEY (uploaded_by) REFERENCES users(user_id),
    INDEX idx_vdoc_expiry (expiry_date)
) ENGINE=InnoDB;

CREATE TABLE drivers (
    driver_id           INT AUTO_INCREMENT PRIMARY KEY,
    user_id             INT UNIQUE,
    full_name           VARCHAR(100) NOT NULL,
    license_number      VARCHAR(50) NOT NULL UNIQUE,
    license_category    VARCHAR(20) NOT NULL,
    license_expiry_date DATE NOT NULL,
    contact_number      VARCHAR(20) NOT NULL,
    safety_score        DECIMAL(5,2) DEFAULT 100.00,
    status              ENUM('Available','On Trip','Off Duty','Suspended') NOT NULL DEFAULT 'Available',
    is_deleted          BOOLEAN DEFAULT FALSE,
    created_at          TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at          TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(user_id),
    INDEX idx_driver_status (status),
    INDEX idx_driver_license_expiry (license_expiry_date)
) ENGINE=InnoDB;

CREATE TABLE driver_status_history (
    history_id      BIGINT AUTO_INCREMENT PRIMARY KEY,
    driver_id       INT NOT NULL,
    old_status      ENUM('Available','On Trip','Off Duty','Suspended'),
    new_status      ENUM('Available','On Trip','Off Duty','Suspended') NOT NULL,
    changed_by      INT,
    reason          VARCHAR(255),
    changed_at      TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (driver_id) REFERENCES drivers(driver_id) ON DELETE CASCADE,
    FOREIGN KEY (changed_by) REFERENCES users(user_id),
    INDEX idx_dsh_driver_time (driver_id, changed_at)
) ENGINE=InnoDB;

CREATE TABLE trips (
    trip_id             INT AUTO_INCREMENT PRIMARY KEY,
    trip_code           VARCHAR(30) NOT NULL UNIQUE,
    source              VARCHAR(150) NOT NULL,
    destination         VARCHAR(150) NOT NULL,
    vehicle_id          INT NOT NULL,
    driver_id           INT NOT NULL,
    cargo_weight        DECIMAL(10,2) NOT NULL,
    planned_distance    DECIMAL(10,2) NOT NULL,
    actual_distance     DECIMAL(10,2),
    starting_odometer   DECIMAL(12,2),
    final_odometer      DECIMAL(12,2),
    fuel_consumed       DECIMAL(10,2),
    revenue             DECIMAL(14,2) DEFAULT 0,
    status              ENUM('Draft','Dispatched','Completed','Cancelled') NOT NULL DEFAULT 'Draft',
    dispatched_at       TIMESTAMP NULL,
    completed_at        TIMESTAMP NULL,
    cancelled_at        TIMESTAMP NULL,
    created_by          INT NOT NULL,
    created_at          TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at          TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (vehicle_id) REFERENCES vehicles(vehicle_id),
    FOREIGN KEY (driver_id) REFERENCES drivers(driver_id),
    FOREIGN KEY (created_by) REFERENCES users(user_id),
    INDEX idx_trip_status (status),
    INDEX idx_trip_vehicle (vehicle_id),
    INDEX idx_trip_driver (driver_id),
    INDEX idx_trip_dates (dispatched_at, completed_at)
) ENGINE=InnoDB;

CREATE TABLE trip_status_history (
    history_id      BIGINT AUTO_INCREMENT PRIMARY KEY,
    trip_id         INT NOT NULL,
    old_status      ENUM('Draft','Dispatched','Completed','Cancelled'),
    new_status      ENUM('Draft','Dispatched','Completed','Cancelled') NOT NULL,
    changed_by      INT,
    changed_at      TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (trip_id) REFERENCES trips(trip_id) ON DELETE CASCADE,
    FOREIGN KEY (changed_by) REFERENCES users(user_id),
    INDEX idx_tsh_trip_time (trip_id, changed_at)
) ENGINE=InnoDB;

CREATE TABLE maintenance_logs (
    maintenance_id   INT AUTO_INCREMENT PRIMARY KEY,
    vehicle_id       INT NOT NULL,
    maintenance_type VARCHAR(100) NOT NULL,
    description      TEXT,
    cost             DECIMAL(14,2) DEFAULT 0,
    status           ENUM('Open','Closed') NOT NULL DEFAULT 'Open',
    opened_at        TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    closed_at        TIMESTAMP NULL,
    created_by       INT NOT NULL,
    updated_at       TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (vehicle_id) REFERENCES vehicles(vehicle_id),
    FOREIGN KEY (created_by) REFERENCES users(user_id),
    INDEX idx_maint_status (status),
    INDEX idx_maint_vehicle (vehicle_id)
) ENGINE=InnoDB;

CREATE TABLE fuel_logs (
    fuel_log_id     INT AUTO_INCREMENT PRIMARY KEY,
    vehicle_id      INT NOT NULL,
    trip_id         INT,
    liters          DECIMAL(10,2) NOT NULL,
    cost            DECIMAL(14,2) NOT NULL,
    log_date        DATE NOT NULL,
    recorded_by     INT NOT NULL,
    created_at      TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (vehicle_id) REFERENCES vehicles(vehicle_id),
    FOREIGN KEY (trip_id) REFERENCES trips(trip_id),
    FOREIGN KEY (recorded_by) REFERENCES users(user_id),
    INDEX idx_fuel_vehicle_date (vehicle_id, log_date)
) ENGINE=InnoDB;

CREATE TABLE expenses (
    expense_id      INT AUTO_INCREMENT PRIMARY KEY,
    vehicle_id      INT NOT NULL,
    trip_id         INT,
    expense_type    ENUM('Toll','Maintenance','Other') NOT NULL,
    amount          DECIMAL(14,2) NOT NULL,
    expense_date    DATE NOT NULL,
    description     VARCHAR(255),
    recorded_by     INT NOT NULL,
    created_at      TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (vehicle_id) REFERENCES vehicles(vehicle_id),
    FOREIGN KEY (trip_id) REFERENCES trips(trip_id),
    FOREIGN KEY (recorded_by) REFERENCES users(user_id),
    INDEX idx_expense_vehicle_date (vehicle_id, expense_date),
    INDEX idx_expense_type (expense_type)
) ENGINE=InnoDB;

CREATE TABLE notifications (
    notification_id   INT AUTO_INCREMENT PRIMARY KEY,
    recipient_user_id INT NOT NULL,
    type              VARCHAR(50) NOT NULL,
    reference_table   VARCHAR(50),
    reference_id      INT,
    message           VARCHAR(255) NOT NULL,
    is_read           BOOLEAN DEFAULT FALSE,
    created_at        TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (recipient_user_id) REFERENCES users(user_id),
    INDEX idx_notif_recipient (recipient_user_id, is_read)
) ENGINE=InnoDB;

CREATE TABLE org_settings (
    setting_id    INT AUTO_INCREMENT PRIMARY KEY,
    depot_name    VARCHAR(100) DEFAULT 'TransitOps Depot',
    currency      VARCHAR(10) DEFAULT 'INR',
    distance_unit VARCHAR(10) DEFAULT 'km',
    updated_at    TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
) ENGINE=InnoDB;
