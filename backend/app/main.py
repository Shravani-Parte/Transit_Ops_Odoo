"""TransitOps FastAPI app entrypoint."""
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from sqlalchemy import text
from app.core.config import settings
from app.api.v1.router import api_router
from app.middleware.error_handler import register_error_handlers
from app.middleware.request_logger import RequestLoggerMiddleware
from app.db.session import SessionLocal
from app.db.init_db import seed_reference_data

app = FastAPI(title="TransitOps API", version="1.0.0")


app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.cors_origins_list,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)
app.add_middleware(RequestLoggerMiddleware)
register_error_handlers(app)

app.include_router(api_router, prefix="/api/v1")


@app.get("/health")
def health():
    return {"status": "ok"}


@app.on_event("startup")
async def startup() -> None:
    # 1) Ensure DB connectivity (fail fast)
    from app.db.session import engine
    from app.db.base import Base

    # Import models here to avoid circular import
    from app.models.role import Role  # noqa
    from app.models.permission import Permission  # noqa
    from app.models.role_permission import RolePermission  # noqa
    from app.models.user import User  # noqa
    from app.models.region import Region  # noqa
    from app.models.vehicle import Vehicle  # noqa
    from app.models.vehicle_status_history import VehicleStatusHistory  # noqa
    from app.models.vehicle_document import VehicleDocument  # noqa
    from app.models.driver import Driver  # noqa
    from app.models.driver_status_history import DriverStatusHistory  # noqa
    from app.models.trip import Trip  # noqa
    from app.models.trip_status_history import TripStatusHistory  # noqa
    from app.models.maintenance_log import MaintenanceLog  # noqa
    from app.models.fuel_log import FuelLog  # noqa
    from app.models.expense import Expense  # noqa
    from app.models.notification import Notification  # noqa

    async with engine.begin() as conn:
        await conn.execute(text("SELECT 1"))
        # Create tables for now (since Alembic is not set up fully)
        await conn.run_sync(Base.metadata.create_all)
    # Seed reference data
    async with SessionLocal() as db:
        await seed_reference_data(db)
    # Let's skip alembic for now to get up and running quickly

