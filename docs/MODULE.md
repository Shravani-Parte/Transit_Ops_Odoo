# TransitOps — Module Breakdown

This document decomposes the platform into discrete, buildable modules — useful for sprint/hackathon-hour planning and for assigning ownership across a team.

## Module Map

```
┌─────────────────────────────────────────────────────────────┐
│                        TransitOps Platform                    │
├───────────────┬───────────────┬───────────────┬──────────────┤
│  1. Auth/RBAC │  2. Dashboard │ 3. Vehicle     │ 4. Driver    │
│               │               │    Registry    │    Mgmt      │
├───────────────┼───────────────┼───────────────┼──────────────┤
│  5. Trip Mgmt │ 6. Maintenance│ 7. Fuel &      │ 8. Reports & │
│               │               │    Expense     │    Analytics │
├───────────────┴───────────────┴───────────────┴──────────────┤
│                    9. Admin Console                            │
└─────────────────────────────────────────────────────────────┘
```

## 1. Auth & RBAC Module
- Login/logout, session/JWT issuance, password hashing.
- Role-check middleware used by every other module.
- **Depends on:** Users, Roles entities.
- **Blocks:** every other module (nothing ships without this).

## 2. Dashboard Module
- KPI cards: Active Vehicles, Available Vehicles, Vehicles in Maintenance, Active Trips, Pending Trips, Drivers On Duty, Fleet Utilization %.
- Filters: vehicle type, status, region.
- **Depends on:** Vehicle, Driver, Trip modules (reads aggregate data from them).

## 3. Vehicle Registry Module
- CRUD for vehicles: registration number (unique), name/model, type, max load capacity, odometer, acquisition cost, status.
- Enforces registration-number uniqueness.
- Exposes the "available vehicles" filtered list consumed by Trip Management.
- **Depends on:** Auth/RBAC.

## 4. Driver Management Module
- CRUD for driver profiles: name, license number, license category, license expiry, contact, safety score, status.
- Exposes the "eligible drivers" filtered list (Available, valid license, not Suspended) consumed by Trip Management.
- Safety Officer actions: suspend/reinstate, edit safety score.
- **Depends on:** Auth/RBAC.

## 5. Trip Management Module
- Trip creation (Draft), dispatch, completion, cancellation — the core state machine (see `PROCESS.md` §3).
- Validation engine: capacity check, availability check, license/status check.
- Atomic status-sync with Vehicle and Driver modules on every transition.
- **Depends on:** Vehicle Registry, Driver Management.
- **Feeds:** Fuel & Expense (fuel-consumed capture on completion), Reports & Analytics.

## 6. Maintenance Module
- Create/close maintenance logs per vehicle.
- Auto vehicle-status sync (In Shop ↔ Available), with the Retired-state exception.
- Cost capture per maintenance record.
- **Depends on:** Vehicle Registry.
- **Feeds:** Fuel & Expense (cost rollups), Reports & Analytics.

## 7. Fuel & Expense Module
- Fuel log entry (liters, cost, date), general expense entry (tolls, fines, etc.).
- Aggregation: total operational cost per vehicle (Fuel + Maintenance [+ Expenses]).
- **Depends on:** Vehicle Registry, Trip Management (optional trip linkage), Maintenance (cost input).
- **Feeds:** Reports & Analytics.

## 8. Reports & Analytics Module
- Computed metrics: Fuel Efficiency, Fleet Utilization, Operational Cost, Vehicle ROI (see `DATA_MODEL.md` §4).
- CSV export (mandatory); PDF export, charts (bonus).
- **Depends on:** Trip, Vehicle, Driver, Maintenance, Fuel & Expense modules for source data.

## 9. Admin Console Module
- User & role management, master-data oversight, system configuration, audit log.
- Fully detailed in `ADMIN_CONSOLE.md`.
- **Depends on:** Auth/RBAC.
- **Cross-cuts:** writes to the audit log from actions in every other module.

## Suggested Build Order (for an 8-hour hackathon)
| Hour | Focus |
|---|---|
| 0–1 | Project scaffold, DB schema, Auth/RBAC skeleton |
| 1–2.5 | Vehicle Registry + Driver Management CRUD |
| 2.5–4.5 | Trip Management state machine + validations (core value prop) |
| 4.5–5.5 | Maintenance module + vehicle status sync |
| 5.5–6.5 | Fuel & Expense logging + cost rollups |
| 6.5–7.5 | Dashboard + Reports (CSV export) |
| 7.5–8 | Admin Console basics, polish, bug bash |


