# TransitOps — Backend (FastAPI)

Placeholder scaffold. Not connected to the frontend in this repo state.

## Run locally (FastAPI + MySQL)

This repo includes `docker-compose.yml` to start MySQL + the backend together.

### Option A: Docker Compose (recommended)
```bash
docker compose up -d --build
```
Then open:
- Backend: http://localhost:8000/health
- API docs: http://localhost:8000/docs

### Option B: Run backend directly
1) Install dependencies:
```bash
python -m venv .venv
# Windows (PowerShell):
.\/.venv\Scripts\Activate.ps1
pip install -r requirements.txt
```
2) Create backend env file (required for DB connectivity):
- Copy `backend/.env.example` to `backend/.env` (or export `DATABASE_URL`).
3) Start:
```bash
uvicorn app.main:app --reload
```

> Note: on startup the backend connects to the configured `DATABASE_URL`, creates tables via `Base.metadata.create_all`, and seeds reference/demo data. Alembic runtime migrations are currently not wired as the startup step.


## Structure
See `docs/REPO_STRUCTURE.md` at the repo root — this backend mirrors it exactly.

## Layers
- `api/v1/endpoints/` — thin HTTP handlers, delegate to services.
- `services/` — business rules (primary enforcement).
- `crud/` — pure DB access.
- `models/` — SQLAlchemy ORM.
- `schemas/` — Pydantic request/response.
- `db/session.py` — async engine + `get_db` dependency.
- `core/permissions.py` — reads `role_permissions` at runtime (RBAC as data).
