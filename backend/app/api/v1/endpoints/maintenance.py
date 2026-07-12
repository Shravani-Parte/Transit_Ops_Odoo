<<<<<<< HEAD
"""maintenance.py — HTTP handlers. Delegates to service layer."""
from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select
from datetime import datetime
from app.api.v1.deps import Pagination, get_db
from app.schemas.maintenance import MaintenanceRead, MaintenanceCreate, MaintenanceClose
from app.models.maintenance_log import MaintenanceLog
from app.models.vehicle import Vehicle

router = APIRouter()


@router.get("/", response_model=dict)
async def list_maintenance(pg: Pagination = Depends(), db: AsyncSession = Depends(get_db)):
    query = select(MaintenanceLog).offset(pg.offset).limit(pg.size)
    result = await db.execute(query)
    items = result.scalars().all()
    count_result = await db.execute(select(MaintenanceLog.id))
    total = len(count_result.scalars().all())
    return {"items": items, "page": pg.page, "size": pg.size, "total": total}


@router.post("/", response_model=MaintenanceRead)
async def open_maintenance(maintenance_in: MaintenanceCreate, db: AsyncSession = Depends(get_db)):
    import uuid
    vehicle_result = await db.execute(select(Vehicle).where(Vehicle.id == maintenance_in.vehicle_id))
    vehicle = vehicle_result.scalar_one_or_none()
    if not vehicle:
        raise HTTPException(status.HTTP_404_NOT_FOUND, "Vehicle not found")
    if vehicle.status == "On Trip":
        raise HTTPException(status.HTTP_400_BAD_REQUEST, "Vehicle is on a trip")

    db_maintenance = MaintenanceLog(
        id=str(uuid.uuid4()),
        **maintenance_in.model_dump(),
        status="Open",
        opened_at=datetime.utcnow()
    )
    db.add(db_maintenance)

    if vehicle.status == "Available":
        vehicle.status = "In Shop"

    await db.commit()
    await db.refresh(db_maintenance)
    return db_maintenance


@router.post("/{mid}/close", response_model=MaintenanceRead)
async def close_maintenance(mid: str, close_in: MaintenanceClose, db: AsyncSession = Depends(get_db)):
    result = await db.execute(select(MaintenanceLog).where(MaintenanceLog.id == mid))
    maintenance = result.scalar_one_or_none()
    if not maintenance:
        raise HTTPException(status.HTTP_404_NOT_FOUND, "Maintenance log not found")
    if maintenance.status != "Open":
        raise HTTPException(status.HTTP_400_BAD_REQUEST, "Maintenance log is not open")

    maintenance.status = "Closed"
    maintenance.closed_at = datetime.utcnow()
    maintenance.cost = close_in.cost

    vehicle_result = await db.execute(select(Vehicle).where(Vehicle.id == maintenance.vehicle_id))
    vehicle = vehicle_result.scalar_one_or_none()
    if vehicle and vehicle.status == "In Shop":
        vehicle.status = "Available"

    await db.commit()
    await db.refresh(maintenance)
    return maintenance

=======
from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session

from app.api.v1.deps import require_perm
from app.db.session import get_db
from app.schemas.maintenance import MaintenanceCreate, MaintenanceOut
from app.services import maintenance_service

router = APIRouter(prefix="/maintenance", tags=["maintenance"])


@router.get("", response_model=list[MaintenanceOut])
def list_maintenance(status: str | None = None, db: Session = Depends(get_db), user=Depends(require_perm("maintenance", "read"))):
    return maintenance_service.list_maintenance(db, status)


@router.post("", response_model=MaintenanceOut)
def create_maintenance(data: MaintenanceCreate, db: Session = Depends(get_db), user=Depends(require_perm("maintenance", "create"))):
    return maintenance_service.create_maintenance(db, data, user.user_id)


@router.post("/{maintenance_id}/close", response_model=MaintenanceOut)
def close_maintenance(maintenance_id: int, db: Session = Depends(get_db), user=Depends(require_perm("maintenance", "update"))):
    return maintenance_service.close_maintenance(db, maintenance_id, user.user_id)
>>>>>>> e21946685e62ae18c3f3933d86dd20bdbac55cd8
