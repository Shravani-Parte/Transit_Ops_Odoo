# TransitOps — Reconciled Repo Structure
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
