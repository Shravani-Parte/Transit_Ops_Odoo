# TransitOps — RBAC Enforcement

## 1. Roles (from source spec)
1. **Fleet Manager** — oversees fleet assets, maintenance, vehicle lifecycle, operational efficiency.
2. **Driver** — creates trips, assigns vehicles/drivers, monitors active deliveries.
3. **Safety Officer** — ensures driver compliance, tracks license validity, monitors safety scores.
4. **Financial Analyst** — reviews expenses, fuel consumption, maintenance costs, profitability.
5. **Admin** *(implied — required to manage users/roles themselves; see `ADMIN_CONSOLE.md`)*.

> Note: the source spec grants "Driver" the ability to assign vehicles and drivers to trips, which is broader than a typical driver role (usually a driver would only see/act on their own trip). This document keeps that as specified but flags it for stakeholder review — see §5.

## 2. Permission Matrix

| Capability | Fleet Manager | Driver | Safety Officer | Financial Analyst | Admin |
|---|:---:|:---:|:---:|:---:|:---:|
| View Dashboard/KPIs | ✅ | ✅ (own trips scope) | ✅ | ✅ | ✅ |
| Create/Edit/Delete Vehicles | ✅ | ❌ | ❌ | 👁 view only | ✅ |
| Create/Edit/Delete Drivers | ✅ | ❌ | 👁 view + edit safety_score/status | 👁 view only | ✅ |
| Create Trip (Draft) | ✅ | ✅ | ❌ | ❌ | ✅ |
| Dispatch Trip | ✅ | ✅ (per spec) | ❌ | ❌ | ✅ |
| Complete/Cancel Trip | ✅ | ✅ (own/assigned) | ❌ | ❌ | ✅ |
| Create/Close Maintenance Log | ✅ | ❌ | ❌ | 👁 view only | ✅ |
| Suspend/Reinstate Driver | ❌ | ❌ | ✅ | ❌ | ✅ |
| Edit License Info | ❌ | ❌ | ✅ | ❌ | ✅ |
| Record Fuel Log | ✅ | ✅ (own trip) | ❌ | 👁 view only | ✅ |
| Record Expense | ✅ | ✅ (own trip) | ❌ | 👁 view only | ✅ |
| View Reports & Analytics | ✅ | ❌ | 👁 safety-related only | ✅ | ✅ |
| Export CSV/PDF | ✅ | ❌ | 👁 safety reports | ✅ | ✅ |
| Manage Users & Roles | ❌ | ❌ | ❌ | ❌ | ✅ |
| System/Org Configuration | ❌ | ❌ | ❌ | ❌ | ✅ |

Legend: ✅ full access · 👁 read-only / scoped · ❌ no access

## 3. Enforcement Layers (Defense in Depth)

RBAC must **never** rely on the UI hiding buttons alone. Enforce at every layer:

### 3.1 Authentication Layer
- Email/password login → issue a signed session token (JWT or server session) containing `user_id` and `role`.
- All API routes require a valid, non-expired token except `/login` and `/health`.

### 3.2 API/Middleware Layer (primary enforcement point)
- A permission-check middleware/guard runs **before** the route handler on every request, e.g.:
  - `requireRole(['FleetManager', 'Admin'])` on `POST /vehicles`
  - `requireRole(['SafetyOfficer', 'Admin'])` on `PATCH /drivers/:id/suspend`
- Scoped access (e.g., a Driver acting only on their own trips) is enforced by checking `trip.driver_id === req.user.driver_id` (or equivalent) inside the handler, not just role membership.
- Return `403 Forbidden` for role violations, `404` (not `403`) when leaking existence of scoped resources the user shouldn't know about is a concern.

### 3.3 Business-Rule Layer (independent of role — applies to whoever is allowed to act)
Regardless of role, these validations execute server-side before any state transition (see `PROCESS.md` §1–4):
- Registration number uniqueness
- Vehicle/driver eligibility (status, license expiry) at dispatch time
- Cargo weight vs. capacity
- Atomic status transitions inside DB transactions

### 3.4 Data Layer
- Row-level constraints/indexes back the uniqueness and status rules (see `DATA_MODEL.md` §3).
- Sensitive fields (e.g., `password_hash`) are never returned in any API response regardless of role.

### 3.5 UI Layer (last, cosmetic only)
- Hide/disable controls the current role can't use — this is a UX convenience, **not** a security boundary. Every hidden action must also be blocked at the API layer.

## 4. Session & Token Handling
- Token expiry: short-lived access token (e.g., 15–60 min) + refresh token, or a server session with idle timeout.
- Role changes (e.g., Admin promotes a user) should invalidate cached role claims — either short token TTLs or a role-version check on each request.
- All RBAC decisions are logged with `user_id`, `action`, `resource`, `result` for audit purposes (ties into `ADMIN_CONSOLE.md` audit log).

## 5. Open Items for Stakeholder Confirmation
- Confirm whether "Driver" should truly be able to dispatch trips end-to-end (per source spec) or whether dispatch should require Fleet Manager approval, with Driver limited to viewing/starting their own assigned trip.
- Confirm whether Financial Analyst needs write access to Expenses (currently modeled as read-only reviewer, per "Reviews operational expenses" in the source spec).
- Confirm whether a single user can hold multiple roles (e.g., a small operation where one person is both Fleet Manager and Admin) — if so, use a `UserRoles` join table instead of a single `role_id` on `Users`.
