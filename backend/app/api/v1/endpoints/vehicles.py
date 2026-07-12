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

