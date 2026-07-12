# TransitOps — Smart Transport Operations Platform

TransitOps is a centralized platform for managing the full lifecycle of transport operations — vehicle registry, driver management, trip dispatch, maintenance, and fuel/expense tracking — replacing spreadsheets and manual logbooks with a system that enforces business rules automatically.

## Problem It Solves
Logistics teams running operations on spreadsheets face scheduling conflicts, underutilized vehicles, missed maintenance, expired driver licenses going unnoticed, inaccurate expense tracking, and no real-time operational visibility. TransitOps centralizes this into one rule-enforcing system of record.

## Core Capabilities
- Secure authentication with Role-Based Access Control (RBAC)
- Real-time dashboard with fleet KPIs and filters
- Vehicle registry with unique registration enforcement
- Driver management with license and safety-score tracking
- Trip lifecycle management (Draft → Dispatched → Completed → Cancelled) with automatic status sync
- Maintenance workflow that automatically pulls vehicles out of the dispatch pool
- Fuel & expense logging with automatic operational cost rollups
- Reports & analytics: fuel efficiency, fleet utilization, operational cost, vehicle ROI, CSV export

## Target Users
| Role | Responsibility |
|---|---|
| Fleet Manager | Vehicle lifecycle, maintenance, operational efficiency |
| Driver | Creates and manages trips |
| Safety Officer | Driver compliance, license validity, safety scores |
| Financial Analyst | Expense, fuel, and profitability reporting |
| Admin | User/role management, system configuration |

## Mandatory Business Rules
- Vehicle registration numbers must be unique.
- Retired or In Shop vehicles are excluded from dispatch.
- Drivers with expired licenses or Suspended status cannot be assigned to trips.
- A vehicle or driver already On Trip cannot be double-booked.
- Cargo weight must not exceed a vehicle's maximum load capacity.
- Dispatch/complete/cancel actions automatically and atomically sync vehicle and driver status.
- Opening/closing a maintenance record automatically toggles vehicle status between In Shop and Available.

Full detail on every rule and the state machines behind them lives in [`PROCESS.md`](./PROCESS.md).

## Tech Stack
- **Frontend:** React (JSX/TSX) + Tailwind CSS, Recharts/Chart.js for analytics
- **Backend:** FastAPI (Python) — routers/dependencies map cleanly to the RBAC guards and module boundaries used in this project; Pydantic gives request/response validation for free
- **Database:** MySQL — relational integrity for uniqueness constraints, foreign keys, and atomic multi-table status transitions (wrapped in DB transactions for dispatch/complete/cancel/maintenance flows)

- **ORM:** SQLAlchemy (+ Alembic for migrations)
- **Auth:** JWT (access + refresh tokens) via `fastapi-users`/`python-jose`, with bcrypt/argon2 password hashing
- **Supporting services:** Redis (caching/sessions), Celery (background jobs for license-expiry reminders), SendGrid/SES (email), Docker (packaging)

## Architecture
A **modular monolith**: one FastAPI application organized into clearly bounded routers/modules (Auth, Vehicles, Drivers, Trips, Maintenance, Fuel & Expense, Reports, Admin), each behind an RBAC dependency layer, with a transactional service layer handling all multi-entity status transitions in MySQL. The React frontend is a decoupled SPA consuming the FastAPI REST endpoints (with auto-generated OpenAPI docs). This keeps delivery fast while leaving a clean path to split out services (e.g., Reports, Notifications) later if needed.

## Local run (backend ↔ DB)
- Start MySQL + backend via `docker-compose.yml`:

```bash
docker compose up -d --build
```

- Verify connectivity:
  - GET http://localhost:8000/health
  - Backend will connect using `DATABASE_URL`, run `Base.metadata.create_all`, and seed reference/demo data.

> If you run backend directly, make sure `backend/.env` (or `DATABASE_URL`) points to your MySQL instance.


## Documentation
This repository's planning documents, each covering one concern in depth:

| Document | Purpose |
|---|---|
| [`PRD.md`](./PRD.md) | Product requirements — goals, personas, scope, non-functional requirements, release plan |
| [`PROCESS.md`](./PROCESS.md) | Workflows and state machines for vehicles, drivers, trips, and maintenance |
| [`DATA_MODEL.md`](./DATA_MODEL.md) | Entities, fields, relationships, constraints, and computed report metrics |
| [`RBAC_ENFORCEMENT.md`](./RBAC_ENFORCEMENT.md) | Permission matrix and the enforcement layers (API, business-rule, data, UI) |
| [`ADMIN_CONSOLE.md`](./ADMIN_CONSOLE.md) | Admin-only module: user/role management, master data, audit log |
| [`MODULE.md`](./MODULE.md) | Module breakdown, dependency map, suggested build order and team split |

## Known Gaps in Original Spec (flagged, not silently assumed)
- The Vehicle ROI formula `(Revenue − (Maintenance + Fuel)) / Acquisition Cost` needs a `Revenue` field that isn't defined anywhere in the source requirements — proposed as an addition to the `Trips` entity in `DATA_MODEL.md`.
- The "Driver" role is specified with fairly broad permissions (creating trips *and* assigning both vehicle and driver), which is unusual for a driver-facing role — kept as specified but flagged in `RBAC_ENFORCEMENT.md` for stakeholder confirmation.

## Suggested Build Order (8-Hour Hackathon Scope)
1. Auth/RBAC skeleton + DB schema
2. Vehicle Registry + Driver Management CRUD
3. Trip Management state machine + validations
4. Maintenance module + vehicle status sync
5. Fuel & Expense logging + cost rollups
6. Dashboard + Reports (CSV export)
7. Admin Console basics + polish

See [`MODULE.md`](./MODULE.md) for the full hour-by-hour breakdown.

## Bonus / Stretch Features
- Charts and visual analytics
- PDF export
- Email reminders for expiring licenses
- Vehicle document management
- Search, filters, and sorting
- Dark mode
