# TransitOps — Data Model

## 1. Entity-Relationship Overview

```
 Users ─────< UserRoles >───── Roles
   │
   │ (created_by / updated_by on most entities)
   ▼
 Vehicles ──1:N──► MaintenanceLogs
   │  │
   │  └──1:N──► FuelLogs
   │
   ├──1:N──► Trips ◄──N:1── Drivers
   │
   └──1:N──► Expenses ◄────(optional link)──── Trips
```

Legend: `1:N` = one-to-many. `Trips` is the central junction connecting a `Vehicle` and a `Driver` for a bounded period.

## 2. Entities

### 2.1 Users
| Field | Type | Notes |
|---|---|---|
| id | UUID/PK | |
| name | string | |
| email | string, unique | login identifier |
| password_hash | string | bcrypt/argon2 |
| role_id | FK → Roles | primary role (or via join table if multi-role) |
| status | enum(Active, Disabled) | |
| created_at / updated_at | timestamp | |

### 2.2 Roles
| Field | Type | Notes |
|---|---|---|
| id | UUID/PK | |
| name | enum(FleetManager, Driver, SafetyOfficer, FinancialAnalyst, Admin) | |
| description | string | |

*(See `RBAC_ENFORCEMENT.md` for the permission matrix per role.)*

### 2.3 Vehicles
| Field | Type | Notes |
|---|---|---|
| id | UUID/PK | |
| registration_number | string, **unique**, indexed | mandatory business rule |
| name_model | string | |
| type | enum/string | e.g., Truck, Van, Bike |
| max_load_capacity | decimal (kg) | used in cargo-weight validation |
| odometer | decimal | updated on trip completion |
| acquisition_cost | decimal | used in ROI calc |
| status | enum(Available, On Trip, In Shop, Retired) | indexed — filtered constantly |
| region | string | dashboard filter |
| created_at / updated_at | timestamp | |

### 2.4 Drivers
| Field | Type | Notes |
|---|---|---|
| id | UUID/PK | |
| name | string | |
| license_number | string, unique | |
| license_category | string | e.g., Class B, Heavy Vehicle |
| license_expiry_date | date | validated at assignment time |
| contact_number | string | |
| safety_score | decimal/int | maintained by Safety Officer |
| status | enum(Available, On Trip, Off Duty, Suspended) | indexed |
| user_id | FK → Users, nullable | if drivers log in themselves |
| created_at / updated_at | timestamp | |

### 2.5 Trips
| Field | Type | Notes |
|---|---|---|
| id | UUID/PK | |
| source | string | |
| destination | string | |
| vehicle_id | FK → Vehicles | |
| driver_id | FK → Drivers | |
| cargo_weight | decimal (kg) | validated ≤ vehicle.max_load_capacity |
| planned_distance | decimal (km) | |
| actual_distance | decimal (km), nullable | filled on completion |
| starting_odometer | decimal | snapshot at dispatch |
| final_odometer | decimal, nullable | filled on completion |
| fuel_consumed | decimal, nullable | filled on completion, or derived from linked Fuel Logs |
| revenue | decimal, nullable | **proposed addition** — required to compute ROI per the spec's formula |
| status | enum(Draft, Dispatched, Completed, Cancelled) | indexed |
| dispatched_at / completed_at / cancelled_at | timestamp, nullable | audit trail |
| created_by | FK → Users | |
| created_at / updated_at | timestamp | |

### 2.6 MaintenanceLogs
| Field | Type | Notes |
|---|---|---|
| id | UUID/PK | |
| vehicle_id | FK → Vehicles | |
| type | string | Oil Change, Repair, Inspection, etc. |
| description | text | |
| cost | decimal | rolls into operational cost |
| status | enum(Open, Closed) | drives vehicle status transitions |
| opened_at | timestamp | |
| closed_at | timestamp, nullable | |
| created_by | FK → Users | |

### 2.7 FuelLogs
| Field | Type | Notes |
|---|---|---|
| id | UUID/PK | |
| vehicle_id | FK → Vehicles | |
| trip_id | FK → Trips, nullable | optional link |
| liters | decimal | |
| cost | decimal | |
| date | date | |
| odometer_at_fill | decimal, nullable | |

### 2.8 Expenses
| Field | Type | Notes |
|---|---|---|
| id | UUID/PK | |
| vehicle_id | FK → Vehicles, nullable | |
| trip_id | FK → Trips, nullable | |
| category | enum(Toll, Fine, Other) | |
| amount | decimal | |
| date | date | |
| notes | string | |

## 3. Key Constraints (Enforced at DB + App Layer)
- `vehicles.registration_number` → `UNIQUE` constraint.
- `drivers.license_number` → `UNIQUE` constraint.
- `vehicles.status`, `drivers.status`, `trips.status` → indexed for fast dashboard aggregation and dispatch-pool filtering.
- Foreign keys `trips.vehicle_id`, `trips.driver_id` → `ON DELETE RESTRICT` (never hard-delete a vehicle/driver with trip history; use soft delete / Retired status instead).
- Check constraint (app-level, ideally also a DB trigger/check where supported): `trips.cargo_weight <= (SELECT max_load_capacity FROM vehicles WHERE id = trips.vehicle_id)`.
- Transactional boundary: any status transition described in `PROCESS.md` (dispatch, complete, cancel, maintenance open/close) must update all affected rows (Trip + Vehicle + Driver) inside a single DB transaction.

## 4. Derived / Computed Values (not stored, computed on read or via materialized view)
- `Fleet Utilization % = (count(vehicles.status = 'On Trip') / count(vehicles.status != 'Retired')) * 100`
- `Fuel Efficiency = trip.actual_distance / trip.fuel_consumed` (or aggregated per vehicle across trips)
- `Operational Cost (per vehicle) = SUM(fuel_logs.cost) + SUM(maintenance_logs.cost) + SUM(expenses.amount)`
- `Vehicle ROI = (SUM(trips.revenue) - (SUM(maintenance_logs.cost) + SUM(fuel_logs.cost))) / vehicles.acquisition_cost`

At scale, consider a nightly or on-write materialized rollup table (`vehicle_cost_summary`) to avoid recomputing aggregates on every dashboard load.

## 5. Notes on Gaps vs. the Original Spec
- The spec's ROI formula requires **Revenue**, which is not defined as a captured field anywhere in section 6 ("Expected Database Entities"). This model adds `trips.revenue` as the minimal viable source; alternatively, an `Invoices` entity could be introduced in a later phase for per-trip billing.
- "Users, Roles" are listed as entities but no fields are specified — the schema above fills that gap with a standard auth/RBAC shape.
