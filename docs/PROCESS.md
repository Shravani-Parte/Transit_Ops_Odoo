# TransitOps — Process Document

This document describes the operational workflows, state machines, and validation sequences that TransitOps must enforce. It complements `DATA_MODEL.md` (structure) and `RBAC_ENFORCEMENT.md` (who can do what).

## 1. Vehicle Lifecycle

```
        ┌────────────┐
        │  Available │◄────────────────────┐
        └─────┬──────┘                      │
              │ dispatch trip                │ complete/cancel trip
              ▼                              │
        ┌────────────┐                      │
        │  On Trip   │──────────────────────┘
        └─────┬──────┘
              │ open maintenance record
              ▼
        ┌────────────┐   close maintenance   ┌────────────┐
        │  In Shop   │──────────────────────►│  Available │
        └─────┬──────┘                       └────────────┘
              │ retire (manual, any state except On Trip)
              ▼
        ┌────────────┐
        │  Retired   │  (terminal — excluded from dispatch permanently)
        └────────────┘
```

**Rules:**
- A vehicle can only enter `On Trip` from `Available`.
- A vehicle can only enter `In Shop` from `Available` (opening maintenance on an On Trip vehicle is blocked).
- Closing maintenance returns the vehicle to `Available` **unless** it was flagged Retired during the maintenance window, in which case it stays `Retired`.
- `Retired` and `In Shop` vehicles are filtered out of every dispatch-selection query at the API layer, not just the UI.

## 2. Driver Lifecycle

```
        ┌────────────┐
        │ Available  │◄───────────────────┐
        └─────┬──────┘                     │
              │ assigned to trip            │ trip completed/cancelled
              ▼                             │
        ┌────────────┐                     │
        │  On Trip   │─────────────────────┘
        └────────────┘

  Off Duty  ◄──── (manual toggle by driver/manager, from Available)
  Suspended ◄──── (manual action by Safety Officer, from any non-On-Trip state)
```

**Rules:**
- Only `Available` drivers with a **non-expired** license appear in the trip-assignment pool.
- `Suspended` drivers are excluded from assignment regardless of license validity.
- License expiry is evaluated at assignment time (not cached), so a license that expires between trips is caught on the next dispatch attempt.

## 3. Trip Lifecycle

```
   Draft ──► Dispatched ──► Completed
     │             │
     │             └──► Cancelled (restores vehicle & driver to Available)
     └──► Cancelled (no restoration needed — nothing was ever reserved)
```

### 3.1 Create Trip (→ Draft)
1. User selects source, destination, cargo weight, planned distance.
2. User selects a vehicle from the **filtered** pool: status = Available (excludes In Shop, Retired, On Trip).
3. User selects a driver from the **filtered** pool: status = Available, license not expired, not Suspended.
4. System validates `cargoWeight ≤ vehicle.maxLoadCapacity`. If violated, block save with a clear error.
5. Trip is persisted with status `Draft`. No status changes to vehicle/driver yet.

### 3.2 Dispatch Trip (Draft → Dispatched)
Re-validate at dispatch time (state may have changed since Draft was created):
1. Vehicle still `Available` (not claimed by another trip in the interim) → else block.
2. Driver still `Available`, license still valid, not `Suspended` → else block.
3. Cargo weight still ≤ capacity → else block.
4. **Atomically**: set Trip.status = `Dispatched`, Vehicle.status = `On Trip`, Driver.status = `On Trip`.
   This must be a single transaction to avoid race conditions where two trips grab the same vehicle.

### 3.3 Complete Trip (Dispatched → Completed)
1. User enters final odometer reading and fuel consumed (or a linked Fuel Log entry).
2. System validates final odometer ≥ starting odometer.
3. **Atomically**: Trip.status = `Completed`, Vehicle.status = `Available`, Driver.status = `Available`, Vehicle.odometer updated.
4. Trip's actual distance/fuel feed into Fuel Efficiency and Operational Cost reports.

### 3.4 Cancel Trip
- From `Draft`: simply mark `Cancelled`; no vehicle/driver state to revert (none was reserved).
- From `Dispatched`: mark `Cancelled` **and atomically** revert Vehicle.status and Driver.status to `Available`.
- `Completed` trips cannot be cancelled (terminal state).

## 4. Maintenance Workflow

1. Fleet Manager creates a Maintenance Log for a vehicle (type: Oil Change, Repair, Inspection, etc.), with status `Open`/`Active`.
2. **On create:** Vehicle.status → `In Shop` (atomic). Vehicle immediately disappears from the trip-dispatch vehicle pool.
   - Guard: cannot open maintenance on a vehicle that is currently `On Trip`.
3. Costs (parts, labor) are logged against the Maintenance Log; these roll into Operational Cost.
4. Fleet Manager closes the Maintenance Log (status → `Closed`).
5. **On close:** Vehicle.status → `Available`, unless the vehicle has separately been marked `Retired`, in which case it remains `Retired`.

## 5. Fuel & Expense Workflow

1. Fuel Log entries (liters, cost, date, odometer at fill-up) are recorded against a vehicle, optionally linked to a trip.
2. General Expenses (tolls, fines, misc.) are recorded against a vehicle and/or trip.
3. System computes, per vehicle:
   - `Total Operational Cost = Σ Fuel Cost + Σ Maintenance Cost (+ Σ Other Expenses)`
4. This aggregate feeds the Reports & Analytics module in near real time (recalculated on read, or via a scheduled/materialized rollup for performance at scale).

## 6. Reports & Analytics Computation

| Metric | Formula | Inputs |
|---|---|---|
| Fuel Efficiency | Distance ÷ Fuel Consumed | Trip distance, Fuel Log liters |
| Fleet Utilization % | (Vehicles On Trip ÷ Total Active Vehicles) × 100 | Vehicle status counts |
| Operational Cost | Fuel Cost + Maintenance Cost (+ Expenses) | Fuel Logs, Maintenance Logs, Expenses |
| Vehicle ROI | (Revenue − (Maintenance + Fuel)) ÷ Acquisition Cost | Revenue *(new field, see DATA_MODEL.md)*, Fuel, Maintenance, Acquisition Cost |

Reports support CSV export (mandatory) and PDF export (bonus).

## 7. End-to-End Example (from source spec, annotated)
1. Register vehicle `Van-05`, max capacity 500 kg → status `Available`.
2. Register driver `Alex` with a valid license → status `Available`.
3. Create trip: cargo weight 450 kg, select Van-05 + Alex → status `Draft`.
4. Validate 450 kg ≤ 500 kg → passes → allow dispatch.
5. Dispatch → Van-05 & Alex both become `On Trip`; Trip becomes `Dispatched`.
6. Complete trip: enter final odometer + fuel consumed → Van-05 & Alex revert to `Available`; Trip becomes `Completed`.
7. Create maintenance record (Oil Change) for Van-05 → Van-05 becomes `In Shop`, hidden from dispatch pool.
8. Reports recompute operational cost and fuel efficiency using the new trip and fuel data.

## 8. Failure / Edge Cases to Handle
- Concurrent dispatch attempts on the same vehicle/driver (race condition) → use DB-level row locking or optimistic concurrency (version column) at dispatch time.
- Attempting to complete a trip that was never dispatched → reject.
- Attempting to open maintenance on a vehicle already `In Shop` → reject (idempotency guard).
- Cargo weight edited after Draft creation but before dispatch → re-validate against capacity at dispatch, not just at creation.
- License expiring exactly on the trip date → treat expiry date as inclusive/exclusive per a documented convention (recommend: license must be valid *through* the trip's planned date).
