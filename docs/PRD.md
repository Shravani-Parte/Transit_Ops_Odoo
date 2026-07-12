# TransitOps — Product Requirements Document (PRD)

## 1. Overview
**Product Name:** TransitOps
**Type:** Smart Transport Operations Platform
**Category:** Fleet / Logistics Operations Management (SaaS-style internal tool)
**Origin:** 8-hour hackathon build; scoped as an MVP with a clear path to a production system.

**Problem Statement:** Logistics companies commonly run vehicle, driver, dispatch, maintenance, and expense management on spreadsheets and paper logbooks. This causes double-booked vehicles/drivers, missed preventive maintenance, expired driver licenses going unnoticed, inaccurate cost tracking, and no real-time visibility into fleet health or utilization.

**Vision:** A single, rule-enforcing system of record for the full transport operations lifecycle — from onboarding a vehicle/driver to dispatching, completing, costing, and reporting on every trip.

## 2. Goals & Success Metrics
| Goal | Metric |
|---|---|
| Eliminate double-booking of vehicles/drivers | 0 concurrent "On Trip" conflicts |
| Prevent unsafe/non-compliant dispatch | 0 trips dispatched with expired license or overloaded cargo |
| Improve visibility | Dashboard KPIs load in <2s, refreshed in near real time |
| Reduce manual cost reconciliation | Automatic per-vehicle operational cost & ROI calculation |
| Increase fleet utilization | Fleet Utilization % trending upward, visible on dashboard |

## 3. Target Users / Personas
1. **Fleet Manager** — owns vehicle lifecycle, oversees utilization and maintenance, most privileged operational role.
2. **Driver** — creates/executes trips, sees only vehicles/drivers relevant to assignment (per the source doc, Drivers can create trips; RBAC detail is refined in RBAC_ENFORCEMENT.md).
3. **Safety Officer** — monitors license validity, safety scores, and compliance; can suspend drivers.
4. **Financial Analyst** — reviews cost, fuel, maintenance spend, and ROI; read-heavy, exports reports.
5. **Admin** *(implied by RBAC requirement, not explicitly named in source but required for user/role management)* — manages users, roles, and system configuration.

## 4. Scope

### 4.1 In Scope (MVP / Mandatory Deliverables)
- Authentication (email/password) + Role-Based Access Control
- Dashboard with fleet KPIs and filters
- Vehicle Registry (CRUD)
- Driver Management (CRUD)
- Trip Management with lifecycle & validation rules
- Maintenance workflow with automatic status transitions
- Fuel & Expense tracking with automatic cost rollups
- Reports & Analytics (Fuel Efficiency, Utilization, Operational Cost, ROI) with CSV export

### 4.2 Bonus / Stretch Scope
- Charts and visual analytics
- PDF export
- Email reminders for expiring licenses
- Vehicle document management (insurance, registration docs)
- Search, filter, sort across modules
- Dark mode

### 4.3 Out of Scope (for this phase)
- Live GPS/telematics hardware integration
- Route optimization / turn-by-turn navigation
- Native mobile apps (responsive web only)
- Payroll / driver payment processing
- Multi-tenant billing (single organization assumed for MVP)

## 5. Functional Requirements Summary
See `MODULE.md` for the full module breakdown and `PROCESS.md` for workflow-level detail. Core modules: Auth/RBAC, Dashboard, Vehicle Registry, Driver Management, Trip Management, Maintenance, Fuel & Expense, Reports & Analytics, Admin Console (user/role management — see `ADMIN_CONSOLE.md`).

## 6. Mandatory Business Rules (Non-Negotiable)
1. Vehicle registration number is globally unique.
2. Retired or In Shop vehicles are excluded from dispatch selection.
3. Drivers with an expired license or Suspended status cannot be assigned to a trip.
4. A vehicle or driver already On Trip cannot be double-assigned.
5. Cargo weight must not exceed the vehicle's maximum load capacity.
6. Dispatch → vehicle & driver status = On Trip (atomic).
7. Trip completion → vehicle & driver status = Available (atomic).
8. Trip cancellation (from Dispatched) → vehicle & driver status revert to Available.
9. Creating an active maintenance record → vehicle status = In Shop.
10. Closing maintenance → vehicle status = Available, unless the vehicle is Retired.

These rules must be enforced **server-side**, not just in the UI (see `RBAC_ENFORCEMENT.md` and `DATA_MODEL.md` for constraint placement).

## 7. Non-Functional Requirements
- **Responsiveness:** usable on desktop and tablet at minimum (mobile-responsive per deliverables).
- **Auditability:** state transitions (dispatch, complete, cancel, maintenance open/close) should be timestamped and attributable to a user.
- **Data integrity:** referential integrity between Trips, Vehicles, Drivers, Maintenance Logs, Fuel Logs, Expenses.
- **Performance:** dashboard aggregate queries should be indexed (status, region, vehicle type).
- **Security:** password hashing, session/JWT-based auth, RBAC enforced at API layer, input validation on all forms.
- **Extensibility:** architecture should allow later addition of GPS telematics, notifications, and multi-tenant support without a rewrite.

## 8. Assumptions & Open Questions
- **Assumption:** Single-organization deployment for MVP; multi-tenant is a future consideration.
- **Assumption:** "Driver" role can create trips per the source spec, but cannot dispatch/approve without Fleet Manager sign-off unless explicitly configured otherwise — flagged for stakeholder confirmation (see RBAC doc).
- **Open question:** Is Revenue per trip captured anywhere to power the ROI formula `(Revenue − (Maintenance + Fuel)) / Acquisition Cost`? The source spec does not define a Revenue field — this PRD proposes adding one (see `DATA_MODEL.md`).
- **Open question:** Are license category and vehicle type validated against each other (e.g., a Class-B license driving a heavy truck)? Not specified in source; recommended as a V2 rule.

## 9. Release Plan (Suggested)
- **MVP (Hackathon/Phase 1):** Auth+RBAC, Vehicle/Driver CRUD, Trip lifecycle with core validations, Maintenance auto-status, Fuel/Expense logging, basic Dashboard, CSV export.
- **Phase 2:** Charts/visual analytics, PDF export, license-expiry email reminders, document management, dark mode, advanced filters/search.
- **Phase 3:** GPS/telematics integration, route optimization, mobile apps, multi-tenant/org support.
