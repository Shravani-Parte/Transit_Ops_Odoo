<<<<<<< HEAD
"""vehicles.py — HTTP handlers. Delegates to service layer."""
from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select
from app.api.v1.deps import Pagination, get_db
from app.schemas.vehicle import VehicleRead, VehicleCreate, VehicleUpdate
from app.models.vehicle import Vehicle
from app.models.region import Region

router = APIRouter()


@router.get("/", response_model=dict)
async def list_vehicles(pg: Pagination = Depends(), db: AsyncSession = Depends(get_db)):
    query = select(Vehicle).offset(pg.offset).limit(pg.size)
    result = await db.execute(query)
    items = result.scalars().all()
    count_result = await db.execute(select(Vehicle.id))
    total = len(count_result.scalars().all())

    # Attach region name
    items_with_regions = []
    for v in items:
        v_dict = VehicleRead.model_validate(v).model_dump()
        if v.region_id:
            region_result = await db.execute(select(Region).where(Region.id == v.region_id))
            region = region_result.scalar_one_or_none()
            v_dict["region"] = region.name if region else None
        items_with_regions.append(v_dict)

    return {"items": items_with_regions, "page": pg.page, "size": pg.size, "total": total}


@router.post("/", response_model=VehicleRead)
async def create_vehicle(vehicle_in: VehicleCreate, db: AsyncSession = Depends(get_db)):
    import uuid
    db_vehicle = Vehicle(
        id=str(uuid.uuid4()),
        **vehicle_in.model_dump(),
        odometer=0,
        status="Available"
    )
    db.add(db_vehicle)
    await db.commit()
    await db.refresh(db_vehicle)
    return db_vehicle


@router.get("/{vid}", response_model=VehicleRead)
async def get_vehicle(vid: str, db: AsyncSession = Depends(get_db)):
    result = await db.execute(select(Vehicle).where(Vehicle.id == vid))
    vehicle = result.scalar_one_or_none()
    if not vehicle:
        raise HTTPException(status.HTTP_404_NOT_FOUND, "Vehicle not found")
    return vehicle


@router.patch("/{vid}", response_model=VehicleRead)
async def update_vehicle(vid: str, vehicle_in: VehicleUpdate, db: AsyncSession = Depends(get_db)):
    result = await db.execute(select(Vehicle).where(Vehicle.id == vid))
    vehicle = result.scalar_one_or_none()
    if not vehicle:
        raise HTTPException(status.HTTP_404_NOT_FOUND, "Vehicle not found")
    update_data = vehicle_in.model_dump(exclude_unset=True)
    for field, value in update_data.items():
        setattr(vehicle, field, value)
    await db.commit()
    await db.refresh(vehicle)
    return vehicle


@router.delete("/{vid}")
async def delete_vehicle(vid: str, db: AsyncSession = Depends(get_db)):
    result = await db.execute(select(Vehicle).where(Vehicle.id == vid))
    vehicle = result.scalar_one_or_none()
    if vehicle:
        await db.delete(vehicle)
        await db.commit()
    return {"ok": True}


@router.get("/{vid}/status-history")
async def status_history(vid: str, db: AsyncSession = Depends(get_db)):
    from app.models.vehicle_status_history import VehicleStatusHistory
    result = await db.execute(select(VehicleStatusHistory).where(VehicleStatusHistory.vehicle_id == vid))
    return result.scalars().all()

=======
from fastapi import APIRouter, Depends, Query
from sqlalchemy.orm import Session

from app.api.v1.deps import require_perm
from app.db.session import get_db
from app.schemas.vehicle import (
    VehicleCreate,
    VehicleOut,
    VehicleStatusHistoryOut,
    VehicleUpdate,
    VehicleDocumentCreate,
    VehicleDocumentOut,
    VehicleCostSummary
)
from app.services import vehicle_service

router = APIRouter(prefix="/vehicles", tags=["vehicles"])


@router.get("", response_model=list[VehicleOut])
def list_vehicles(
    status: str | None = None,
    vehicle_type: str | None = None,
    region_id: int | None = None,
    search: str | None = None,
    available_only: bool = False,
    db: Session = Depends(get_db),
    user=Depends(require_perm("vehicle", "read")),
):
    if available_only:
        return vehicle_service.get_available_vehicles(db)
    return vehicle_service.list_vehicles(db, status, vehicle_type, region_id, search)


@router.get("/{vehicle_id}", response_model=VehicleOut)
def get_vehicle(vehicle_id: int, db: Session = Depends(get_db), user=Depends(require_perm("vehicle", "read"))):
    return vehicle_service.get_vehicle(db, vehicle_id)


@router.post("", response_model=VehicleOut)
def create_vehicle(data: VehicleCreate, db: Session = Depends(get_db), user=Depends(require_perm("vehicle", "create"))):
    return vehicle_service.create_vehicle(db, data, user.user_id)


@router.put("/{vehicle_id}", response_model=VehicleOut)
def update_vehicle(vehicle_id: int, data: VehicleUpdate, db: Session = Depends(get_db), user=Depends(require_perm("vehicle", "update"))):
    return vehicle_service.update_vehicle(db, vehicle_id, data, user.user_id)


@router.delete("/{vehicle_id}")
def delete_vehicle(vehicle_id: int, db: Session = Depends(get_db), user=Depends(require_perm("vehicle", "delete"))):
    vehicle_service.delete_vehicle(db, vehicle_id)
    return {"message": "Vehicle deleted"}


@router.post("/{vehicle_id}/retire", response_model=VehicleOut)
def retire_vehicle(vehicle_id: int, db: Session = Depends(get_db), user=Depends(require_perm("vehicle", "update"))):
    return vehicle_service.retire_vehicle(db, vehicle_id, user.user_id)


@router.get("/{vehicle_id}/status-history", response_model=list[VehicleStatusHistoryOut])
def status_history(vehicle_id: int, db: Session = Depends(get_db), user=Depends(require_perm("vehicle", "read"))):
    return vehicle_service.get_status_history(db, vehicle_id)


@router.get("/{vehicle_id}/documents", response_model=list[VehicleDocumentOut])
def list_documents(vehicle_id: int, db: Session = Depends(get_db), user=Depends(require_perm("vehicle", "read"))):
    return vehicle_service.list_documents(db, vehicle_id)


@router.post("/{vehicle_id}/documents", response_model=VehicleDocumentOut)
def create_document(
    vehicle_id: int,
    data: VehicleDocumentCreate,
    db: Session = Depends(get_db),
    user=Depends(require_perm("vehicle", "update"))
):
    return vehicle_service.create_document(db, vehicle_id, data, user.user_id)


@router.delete("/{vehicle_id}/documents/{document_id}")
def delete_document(
    vehicle_id: int,
    document_id: int,
    db: Session = Depends(get_db),
    user=Depends(require_perm("vehicle", "update"))
):
    vehicle_service.delete_document(db, vehicle_id, document_id)
    return {"message": "Document deleted"}


@router.get("/{vehicle_id}/cost-summary", response_model=VehicleCostSummary)
def get_cost_summary(vehicle_id: int, db: Session = Depends(get_db), user=Depends(require_perm("vehicle", "read"))):
    return vehicle_service.get_cost_summary(db, vehicle_id)
>>>>>>> e21946685e62ae18c3f3933d86dd20bdbac55cd8
