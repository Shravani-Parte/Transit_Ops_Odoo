# TransitOps — Admin Console

The source spec requires RBAC but doesn't explicitly detail an administration surface. Since RBAC, uniqueness rules, and org-wide configuration all need somewhere to live, this document defines the Admin Console as the operational backbone that makes those requirements actually manageable.

## 1. Purpose
A restricted area (Admin role only — see `RBAC_ENFORCEMENT.md`) for managing users, roles, system configuration, and data integrity oversight that doesn't belong to any single operational module (Vehicles, Drivers, Trips, etc.).

## 2. Modules within the Admin Console

### 2.1 User Management
- List, search, filter users by role/status.
- Create user (name, email, temp password/invite flow), assign role(s).
- Disable/re-enable a user account (soft-disable, not hard delete, to preserve audit trail on records they created).
- Reset password / force password reset on next login.
- View last-login and activity summary per user.

### 2.2 Role & Permission Management
- View the permission matrix (see `RBAC_ENFORCEMENT.md` §2) — MVP can ship with fixed roles.
- Stretch goal: allow Admin to define custom roles by toggling permissions on the matrix (deferred beyond MVP given hackathon scope).

### 2.3 Master Data Oversight
- View/resolve duplicate or conflicting registration numbers / license numbers flagged by the uniqueness constraint (surface DB constraint violations as friendly errors, not raw SQL errors).
- Bulk import vehicles/drivers via CSV (bonus), with row-level validation feedback before commit.
- Retire/reactivate vehicles outside the normal maintenance flow (admin override).

### 2.4 System Configuration
- Manage the list of Regions, Vehicle Types, License Categories, Expense Categories (lookup tables referenced across modules).
- Configure license-expiry reminder lead time (e.g., notify 30/14/7 days before expiry) — supports the bonus "Email reminders for expiring licenses" feature.
- Toggle feature flags (e.g., PDF export, dark mode default) if built as configurable.

### 2.5 Audit Log Viewer
- Read-only, filterable log of sensitive actions: login attempts, role changes, driver suspensions, trip dispatch/cancel overrides, maintenance force-closes.
- Each entry: timestamp, actor (user), action, target entity/id, before/after values where applicable (from §3.4/3.5 of `RBAC_ENFORCEMENT.md`).
- Exportable to CSV for compliance review.

### 2.6 Data Export / Backup Hooks
- Trigger CSV export of any core entity table for offline backup or migration (complements the Reports module's business-facing exports).

## 3. Access Control for the Admin Console Itself
- Entire `/admin/*` route namespace (or equivalent) is gated by `requireRole(['Admin'])` at the middleware layer — no exceptions, no partial access for other roles.
- Every write action inside the console is written to the Audit Log (§2.5) automatically, including who performed it.
- Consider a secondary confirmation step (e.g., re-enter password) for destructive actions like disabling a user or force-retiring a vehicle.

## 4. UI Considerations
- Visually distinct from the operational modules (e.g., a separate top-level nav item, distinct color accent) so admins always know they're in a privileged context.
- Tables with search, filter, sort, and pagination — this area will accumulate the most rows over time (users, audit log).
- Confirmation modals on all destructive/irreversible actions.

## 5. MVP vs. Later Phases
| Feature | Phase |
|---|---|
| User CRUD + role assignment | MVP |
| Fixed role permission matrix (read-only view) | MVP |
| Master data uniqueness conflict handling | MVP |
| Audit log (basic) | MVP |
| Region/Type/Category lookup management | MVP |
| CSV bulk import | Phase 2 (bonus) |
| Custom/dynamic role builder | Phase 2+ |
| License-expiry reminder configuration + email dispatch | Phase 2 (bonus) |
| Feature flag toggles | Phase 2+ |
