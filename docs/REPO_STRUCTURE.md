# TransitOps — Reconciled Repo Structure (Final)
**Stack:** React + Vite, JSX only (no TypeScript) · FastAPI (backend) · MySQL (database) · Docker Compose (orchestration)

This supersedes the earlier `TransitOps_Project_Structure.md`. It keeps everything that was already correct in that file and resolves the 7 flagged differences against the mock and the planning docs. Resolution notes are called out inline with `⚑ RESOLVED:` and summarized in the table at the bottom.

> **Assumption carried forward, not yet formally signed off by the org:** roles are **Fleet Manager, Dispatcher, Safety Officer, Financial Analyst** (matches the mock's login screen and access-scope text). There is **no 5th "Admin" role** — Settings/system config is scoped to existing roles (primarily Fleet Manager) via the `role_permissions` table. If the org later confirms "Driver" instead of "Dispatcher," it's a rename in three places: `seed_data.sql`, `models/user.py` role enum, and `config/constants.js`.

---

## Root Layout

```
transitops/
├── frontend/                  # React + Vite app (JSX only)
├── backend/                   # FastAPI app
├── database/                  # standalone SQL reference files (not app code)
│   ├── schema.sql             # raw CREATE TABLE script
│   ├── seed_data.sql          # roles/permissions/regions seed
│   └── triggers_views.sql     # status-transition triggers + reporting views
├── docs/                      # ⚑ NEW — planning docs live here, not scattered at root
│   ├── PRD.md
│   ├── PROCESS.md
│   ├── DATA_MODEL.md
│   ├── RBAC_ENFORCEMENT.md
│   ├── MODULE.md
│   └── STAKEHOLDERS.md        # ⚑ NEW — from the stakeholder list we built
├── docker-compose.yml         # boots frontend + backend + mysql together
├── .env.example
└── README.md
```

**Why `database/` is thin, not a 3rd app folder:** MySQL has no application code of its own — the live schema is managed by Alembic *inside* `backend/`. The standalone `.sql` files exist purely so anyone can run `mysql < database/schema.sql` and see the full DB instantly.

**⚑ RESOLVED (Diff #2 — Admin Console):** No `docs/ADMIN_CONSOLE.md` and no `admin/` module anywhere below. Settings is a normal, role-scoped nav item — not a privileged 5th role.

---

## `frontend/` — React + Vite (JSX only)

```
frontend/
├── public/
│   └── favicon.svg
├── src/
│   ├── main.jsx
│   ├── App.jsx
│   ├── router.jsx                      # routes + RBAC guards
│   │
│   ├── config/
│   │   ├── theme.js                    # colors, spacing, typography tokens
│   │   ├── constants.js                # status enums, ROLE_NAMES = ['FleetManager','Dispatcher','SafetyOfficer','FinancialAnalyst']
│   │   └── permissions.js              # role → module access map (mirrors role_permissions table — data-driven, not hardcoded per-screen)
│   │
│   ├── assets/
│   │   ├── icons/
│   │   └── images/
│   │
│   ├── styles/
│   │   ├── globals.css
│   │   └── tailwind.config.js
│   │
│   ├── app/                            # shell: layout, nav, providers
│   │   ├── AppLayout.jsx
│   │   ├── Sidebar.jsx                 # role-aware nav — labels: Dashboard, Fleet, Drivers, Trips, Maintenance, Fuel & Expenses, Analytics, Settings
│   │   ├── Topbar.jsx
│   │   ├── Breadcrumbs.jsx
│   │   └── AppProviders.jsx
│   │
│   ├── auth/
│   │   ├── LoginPage.jsx               # role selector matches mock: Fleet Manager / Dispatcher / Safety Officer / Financial Analyst
│   │   ├── useAuth.js
│   │   ├── AuthContext.jsx
│   │   ├── RequireAuth.jsx
│   │   ├── RequireRole.jsx
│   │   └── authApi.js
│   │
│   ├── common/                         # shared dumb UI components
│   │   ├── components/
│   │   │   ├── Button.jsx
│   │   │   ├── Input.jsx
│   │   │   ├── Select.jsx
│   │   │   ├── Modal.jsx
│   │   │   ├── Drawer.jsx
│   │   │   ├── Table.jsx
│   │   │   ├── StatusBadge.jsx         # single source of truth for status colors
│   │   │   ├── KpiCard.jsx
│   │   │   ├── EmptyState.jsx
│   │   │   ├── LoadingSpinner.jsx
│   │   │   ├── ConfirmDialog.jsx
│   │   │   ├── Toast.jsx
│   │   │   ├── Pagination.jsx
│   │   │   ├── SearchBar.jsx
│   │   │   ├── FilterBar.jsx
│   │   │   └── DateRangePicker.jsx
│   │   ├── hooks/
│   │   │   ├── useDebounce.js
│   │   │   ├── usePagination.js
│   │   │   ├── useFilters.js
│   │   │   └── useToast.js
│   │   └── utils/
│   │       ├── formatCurrency.js       # INR formatting (per mock's Settings → Currency)
│   │       ├── formatDate.js
│   │       └── validators.js
│   │
│   ├── api/
│   │   ├── axiosClient.js
│   │   └── endpoints.js
│   │
│   ├── modules/
│   │   ├── dashboard/
│   │   │   ├── DashboardPage.jsx
│   │   │   ├── components/
│   │   │   │   ├── KpiGrid.jsx
│   │   │   │   ├── FleetUtilizationGauge.jsx
│   │   │   │   ├── ActiveTripsMap.jsx
│   │   │   │   └── DashboardFilters.jsx
│   │   │   ├── hooks/useDashboardKpis.js
│   │   │   └── dashboardApi.js
│   │   │
│   │   ├── vehicles/                   # "Fleet" in nav — Fleet Manager: full · Dispatcher: view · Safety Officer: none · Financial Analyst: view
│   │   │   ├── VehicleListPage.jsx
│   │   │   ├── VehicleDetailPage.jsx
│   │   │   ├── components/
│   │   │   │   ├── VehicleTable.jsx
│   │   │   │   ├── VehicleForm.jsx
│   │   │   │   ├── VehicleStatusHistory.jsx    # ⚑ backed by vehicle_status_history table
│   │   │   │   ├── VehicleDocumentsPanel.jsx   # bonus
│   │   │   │   └── VehicleCostSummary.jsx
│   │   │   ├── hooks/
│   │   │   │   ├── useVehicles.js
│   │   │   │   └── useVehicleDetail.js
│   │   │   └── vehiclesApi.js
│   │   │
│   │   ├── drivers/                    # Fleet Manager: full · Safety Officer: full · Dispatcher: none · Financial Analyst: none
│   │   │   ├── DriverListPage.jsx
│   │   │   ├── DriverDetailPage.jsx
│   │   │   ├── components/
│   │   │   │   ├── DriverTable.jsx     # includes Trip Completion %, Safety status, and overall Status as distinct columns (per mock)
│   │   │   │   ├── DriverForm.jsx
│   │   │   │   ├── DriverComplianceCard.jsx
│   │   │   │   └── DriverStatusHistory.jsx     # ⚑ backed by driver_status_history table
│   │   │   ├── hooks/useDrivers.js
│   │   │   └── driversApi.js
│   │   │
│   │   ├── trips/                      # "Trips" in nav — Dispatcher: full · Safety Officer: view · Fleet Manager: none · Financial Analyst: none
│   │   │   ├── TripListPage.jsx
│   │   │   ├── TripCreatePage.jsx
│   │   │   ├── TripDetailPage.jsx
│   │   │   ├── components/
│   │   │   │   ├── TripTable.jsx
│   │   │   │   ├── TripWizard/
│   │   │   │   │   ├── Step1_RouteInfo.jsx
│   │   │   │   │   ├── Step2_VehicleDriverSelect.jsx   # pulls only Available vehicles/drivers, non-expired license
│   │   │   │   │   ├── Step3_CargoValidation.jsx       # cargo ≤ capacity check, blocks dispatch on violation
│   │   │   │   │   └── Step4_Review.jsx
│   │   │   │   ├── TripStatusStepper.jsx               # Draft → Dispatched → Completed / Cancelled
│   │   │   │   ├── TripCompletionForm.jsx              # odometer → fuel log → expenses → Available
│   │   │   │   └── TripCancelDialog.jsx
│   │   │   ├── hooks/
│   │   │   │   ├── useTrips.js
│   │   │   │   └── useAvailablePool.js
│   │   │   └── tripsApi.js
│   │   │
│   │   ├── maintenance/                # Fleet Manager: full (per mock, folded under Fleet access) · all others: none/view
│   │   │   ├── MaintenanceListPage.jsx
│   │   │   ├── components/
│   │   │   │   ├── MaintenanceTable.jsx
│   │   │   │   ├── MaintenanceForm.jsx
│   │   │   │   └── CloseMaintenanceDialog.jsx
│   │   │   ├── hooks/useMaintenance.js
│   │   │   └── maintenanceApi.js
│   │   │
│   │   ├── fuel-expense/               # Financial Analyst: full · others: none/view
│   │   │   ├── FuelLogPage.jsx
│   │   │   ├── ExpenseLogPage.jsx
│   │   │   ├── components/
│   │   │   │   ├── FuelLogForm.jsx
│   │   │   │   ├── ExpenseForm.jsx
│   │   │   │   └── ExpenseTypeFilter.jsx
│   │   │   ├── hooks/useFuelExpense.js
│   │   │   └── fuelExpenseApi.js
│   │   │
│   │   ├── reports/                    # "Analytics" in nav — Fleet Manager: view · Financial Analyst: full
│   │   │   ├── ReportsPage.jsx
│   │   │   ├── components/
│   │   │   │   ├── FuelEfficiencyChart.jsx
│   │   │   │   ├── FleetUtilizationChart.jsx
│   │   │   │   ├── OperationalCostChart.jsx
│   │   │   │   ├── VehicleRoiTable.jsx             # ROI = (Revenue − (Maintenance + Fuel)) / Acquisition Cost
│   │   │   │   ├── MonthlyRevenueWidget.jsx        # ⚑ matches mock's "Monthly Revenue" panel
│   │   │   │   └── ExportButtons.jsx               # CSV mandatory, PDF bonus
│   │   │   ├── hooks/useReports.js
│   │   │   └── reportsApi.js
│   │   │
│   │   ├── notifications/              # bonus: license expiry reminders
│   │   │   ├── NotificationsPanel.jsx
│   │   │   └── notificationsApi.js
│   │   │
│   │   └── settings/                   # NOT an admin console — general org config + role-scoped RBAC viewer
│   │       ├── GeneralSettingsPage.jsx # Depot Name, Currency, Distance Unit — from mock
│   │       ├── RbacViewerPage.jsx      # read-only view of role_permissions matrix (from mock's Settings screen)
│   │       ├── ProfilePage.jsx
│   │       └── ThemeToggle.jsx         # bonus: dark mode
│   │
│   └── store/
│       ├── authStore.js
│       └── uiStore.js
│
├── .env.example
├── package.json
├── vite.config.js
└── tailwind.config.js
```

**⚑ RESOLVED (Diff #7 — JSX vs TSX):** confirmed JSX-only, no `.tsx`/`.ts` files anywhere in the tree.

---

## `backend/` — FastAPI

```
backend/
├── app/
│   ├── main.py                          # app instance, routers, middleware
│   ├── __init__.py
│   │
│   ├── core/
│   │   ├── config.py                    # env vars, settings
│   │   ├── security.py                  # password hashing, JWT
│   │   ├── permissions.py               # role→module→action dependency — reads role_permissions table at runtime, not hardcoded
│   │   ├── logging_config.py
│   │   └── exceptions.py
│   │
│   ├── db/
│   │   ├── session.py                   # async engine, get_db dependency
│   │   ├── base.py                      # declarative Base, imports all models
│   │   └── init_db.py                   # seeds roles (Fleet Manager, Dispatcher, Safety Officer, Financial Analyst), permissions, regions
│   │
│   ├── models/                          # SQLAlchemy ORM — one file per entity
│   │   ├── role.py                      # enum: FleetManager, Dispatcher, SafetyOfficer, FinancialAnalyst
│   │   ├── permission.py                # ⚑ explicit permission model (Diff #4)
│   │   ├── role_permission.py           # ⚑ join table — RBAC as data (Diff #3)
│   │   ├── user.py
│   │   ├── region.py                    # ⚑ normalized entity, not a string field (Diff #4)
│   │   ├── vehicle.py
│   │   ├── vehicle_status_history.py    # ⚑ audit trail (Diff #4)
│   │   ├── vehicle_document.py          # bonus
│   │   ├── driver.py
│   │   ├── driver_status_history.py     # ⚑ audit trail (Diff #4)
│   │   ├── trip.py                      # includes revenue field, needed for ROI formula
│   │   ├── trip_status_history.py       # ⚑ audit trail (Diff #4)
│   │   ├── maintenance_log.py
│   │   ├── fuel_log.py
│   │   ├── expense.py
│   │   └── notification.py              # bonus
│   │
│   ├── schemas/                         # Pydantic request/response models
│   │   ├── auth.py
│   │   ├── user.py
│   │   ├── role.py
│   │   ├── permission.py                # ⚑ new — matches permission/role_permission models
│   │   ├── region.py                    # ⚑ new
│   │   ├── vehicle.py
│   │   ├── driver.py
│   │   ├── trip.py
│   │   ├── maintenance.py
│   │   ├── fuel_expense.py
│   │   ├── report.py
│   │   ├── dashboard.py
│   │   └── notification.py
│   │
│   ├── api/
│   │   └── v1/
│   │       ├── router.py                # aggregates all routers under /api/v1
│   │       ├── deps.py                  # get_current_user, require_role/require_permission, pagination
│   │       └── endpoints/
│   │           ├── auth.py              # /login /logout /me
│   │           ├── users.py
│   │           ├── roles.py             # ⚑ new — CRUD for role_permissions (read-mostly per mock's Settings screen)
│   │           ├── regions.py           # ⚑ new
│   │           ├── dashboard.py         # /dashboard/kpis, /dashboard/filters
│   │           ├── vehicles.py          # CRUD + /vehicles/{id}/status-history
│   │           ├── vehicle_documents.py # bonus
│   │           ├── drivers.py           # CRUD + /drivers/{id}/status-history
│   │           ├── trips.py             # CRUD + /dispatch /complete /cancel
│   │           ├── maintenance.py       # CRUD + /maintenance/{id}/close
│   │           ├── fuel_logs.py
│   │           ├── expenses.py
│   │           ├── reports.py           # /roi /fuel-efficiency /utilization /cost /revenue
│   │           ├── exports.py           # /export/csv /export/pdf
│   │           └── notifications.py
│   │
│   ├── services/                        # ALL business rules live here — DB triggers are a second, defense-in-depth layer (Diff #5), not the primary one
│   │   ├── auth_service.py
│   │   ├── vehicle_service.py
│   │   ├── driver_service.py
│   │   ├── trip_service.py              # cargo/capacity, double-booking, status automation — re-validated at dispatch time
│   │   ├── maintenance_service.py       # open/close ↔ vehicle status sync
│   │   ├── fuel_expense_service.py
│   │   ├── report_service.py            # ROI, fuel efficiency, utilization formulas — reads from SQL views (Diff #6)
│   │   ├── export_service.py            # CSV (pandas) / PDF (bonus)
│   │   └── notification_service.py      # license expiry scan
│   │
│   ├── crud/                            # pure DB access, no business rules
│   │   ├── base.py                      # generic CRUD base class
│   │   ├── crud_user.py
│   │   ├── crud_role.py                 # ⚑ new
│   │   ├── crud_region.py               # ⚑ new
│   │   ├── crud_vehicle.py
│   │   ├── crud_driver.py
│   │   ├── crud_trip.py
│   │   ├── crud_maintenance.py
│   │   ├── crud_fuel_log.py
│   │   ├── crud_expense.py
│   │   └── crud_notification.py
│   │
│   ├── tasks/                           # background/scheduled jobs
│   │   ├── celery_app.py
│   │   ├── license_expiry_check.py      # daily scan → notifications + emails
│   │   └── email_sender.py              # bonus: SMTP
│   │
│   ├── utils/
│   │   ├── pagination.py
│   │   ├── filters.py
│   │   ├── formatters.py
│   │   └── validators.py                # cargo≤capacity, license expiry checks — app-layer enforcement, mirrored by DB triggers
│   │
│   └── middleware/
│       ├── error_handler.py
│       ├── cors.py
│       └── request_logger.py
│
├── alembic/
│   ├── versions/
│   └── env.py
├── alembic.ini
│
├── tests/
│   ├── conftest.py
│   ├── test_auth.py
│   ├── test_rbac.py                     # ⚑ new — tests role_permissions data-driven access, not hardcoded checks
│   ├── test_vehicles.py
│   ├── test_drivers.py
│   ├── test_trips.py                    # dispatch/complete/cancel + validation rules
│   ├── test_maintenance.py
│   ├── test_fuel_expense.py
│   └── test_reports.py
│
├── .env.example
├── requirements.txt
├── Dockerfile
└── README.md
```

**⚑ RESOLVED (Diff #3 — RBAC as data):** `permissions.py` is a dependency that reads `role_permissions` at runtime; `roles.py`/`regions.py` endpoints and `crud_role.py`/`crud_region.py` added so the data-driven model is actually queryable/manageable, not just seeded once and forgotten.

---

## `database/` — Standalone SQL reference

```
database/
├── schema.sql             # roles, permissions, role_permissions, users, regions, vehicles,
│                           # drivers, trips (incl. revenue), maintenance_logs, fuel_logs, expenses,
│                           # notifications, vehicle_documents + all *_status_history tables
├── seed_data.sql           # 4 roles: Fleet Manager, Dispatcher, Safety Officer,     ⚑ RESOLVED (Diff #1)
│                           # Financial Analyst — + their permission sets from the mock's matrix:
│                           #   Fleet Manager    → Fleet: full, Drivers: full, Analytics: view
│                           #   Dispatcher       → Fleet: view, Trips: full
│                           #   Safety Officer   → Drivers: full, Trips: view
│                           #   Financial Analyst→ Fleet: view, Fuel/Exp: full, Analytics: full
└── triggers_views.sql      # trg_trip_before_insert, trg_trip_dispatch,               ⚑ documented as
                             # trg_maintenance_open, trg_maintenance_close,            secondary/defense-in-
                             # v_vehicle_operational_cost, v_fuel_efficiency,          depth layer, not the
                             # v_vehicle_roi, v_fleet_utilization, v_dashboard_kpis    only enforcement point
```

Alembic (inside `backend/alembic/`) remains the **runtime** source of truth for migrations; these `.sql` files are a **point-in-time snapshot** for quick setup and demo/judging clarity — keep them in sync manually or regenerate from the latest migration.

**⚑ RESOLVED (Diff #6 — SQL views):** `report_service.py` explicitly reads from these views rather than recomputing aggregates in Python on every request; `DATA_MODEL.md` should be updated to state this as the implementation choice, not just "computed on read."

---

## Root Orchestration Files

```
transitops/
├── docker-compose.yml   # services: frontend, backend, mysql
├── .env.example          # shared root-level example (DB creds, JWT secret, ports)
└── README.md              # setup instructions, architecture overview, links into docs/
```

`docker-compose.yml` sketch (unchanged from prior version):
```yaml
services:
  mysql:
    image: mysql:8
    env_file: .env
    volumes:
      - db_data:/var/lib/mysql
      - ./database/schema.sql:/docker-entrypoint-initdb.d/1_schema.sql
      - ./database/seed_data.sql:/docker-entrypoint-initdb.d/2_seed.sql
      - ./database/triggers_views.sql:/docker-entrypoint-initdb.d/3_triggers.sql
    ports: ["3306:3306"]

  backend:
    build: ./backend
    env_file: .env
    depends_on: [mysql]
    ports: ["8000:8000"]

  frontend:
    build: ./frontend
    env_file: .env
    depends_on: [backend]
    ports: ["5173:5173"]

volumes:
  db_data:
```

---

## Feature → Layer Traceability

| Spec Feature | Frontend | Backend | Database |
|---|---|---|---|
| Auth + RBAC (3.1) | `auth/`, `config/permissions.js` | `core/security.py`, `core/permissions.py`, `endpoints/auth.py`, `endpoints/roles.py` | `roles`, `permissions`, `role_permissions`, `users` |
| Dashboard (3.2) | `modules/dashboard/` | `endpoints/dashboard.py`, `report_service.py` | `v_dashboard_kpis` |
| Vehicle Registry / "Fleet" (3.3) | `modules/vehicles/` | `endpoints/vehicles.py`, `vehicle_service.py` | `vehicles`, `vehicle_status_history`, `regions` |
| Driver Management (3.4) | `modules/drivers/` | `endpoints/drivers.py`, `driver_service.py` | `drivers`, `driver_status_history` |
| Trip Management (3.5) + rules (Sec 4) | `modules/trips/` | `endpoints/trips.py`, `trip_service.py` | `trips`, `trip_status_history`, triggers |
| Maintenance (3.6) | `modules/maintenance/` | `endpoints/maintenance.py`, `maintenance_service.py` | `maintenance_logs`, triggers |
| Fuel & Expense (3.7) | `modules/fuel-expense/` | `endpoints/fuel_logs.py`, `endpoints/expenses.py` | `fuel_logs`, `expenses` |
| Reports & Analytics (3.8) | `modules/reports/` | `endpoints/reports.py`, `endpoints/exports.py` | `v_fuel_efficiency`, `v_vehicle_operational_cost`, `v_vehicle_roi`, `v_fleet_utilization` |
| Settings (RBAC viewer + org config) | `modules/settings/` | `endpoints/roles.py`, `endpoints/regions.py` | `role_permissions`, `regions` |
| Email reminders (bonus) | `modules/notifications/` | `tasks/license_expiry_check.py`, `email_sender.py` | `notifications` |
| Vehicle documents (bonus) | `VehicleDocumentsPanel.jsx` | `endpoints/vehicle_documents.py` | `vehicle_documents` |
| Dark mode (bonus) | `ThemeToggle.jsx`, `theme.js` | — | — |

---

## Resolution Summary — All 7 Flagged Differences

| # | Difference | Resolution in this structure |
|---|---|---|
| 1 | Role naming: "Driver" (seed_data.sql) vs "Dispatcher" (mock) | **Dispatcher** used throughout — matches mock's actual described responsibilities. *Not yet formally confirmed by the org.* |
| 2 | Admin role / Admin Console not in mock or structure | **Dropped.** No `admin/` module anywhere; Settings is role-scoped, not a privileged 5th role |
| 3 | RBAC as data (`role_permissions`) vs static matrix in docs | Kept as data-driven; `core/permissions.py` reads it at runtime; docs (`RBAC_ENFORCEMENT.md`) to be updated to describe the matrix as **seed data**, not hardcoded logic |
| 4 | Extra entities missing from `DATA_MODEL.md` | All included: `permissions`, `role_permissions`, `regions` (normalized), `*_status_history` (×3), `vehicle_documents`, `notifications` |
| 5 | DB triggers vs app-layer-only enforcement | Both layers kept — triggers documented explicitly as a **secondary/defense-in-depth** layer; `services/` remains the primary enforcement point |
| 6 | Reports as SQL views vs "computed on read" | Kept as SQL views (`v_*`); `report_service.py` reads from them directly |
| 7 | `.jsx` vs `.tsx` | **Confirmed `.jsx` only** — no TypeScript files in the tree |

**Still open:** Item #1 (Dispatcher vs. Driver) is a recommendation, not a confirmed org decision. Everything else above is fully reconciled and safe to scaffold against.
