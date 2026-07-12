<<<<<<< HEAD
"""trips.py — HTTP handlers. Delegates to service layer."""
from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select
from datetime import datetime
from app.api.v1.deps import Pagination, get_db
from app.schemas.trip import TripRead, TripCreate, TripCompletion
from app.models.trip import Trip
from app.models.vehicle import Vehicle
from app.models.driver import Driver

router = APIRouter()


@router.get("/", response_model=dict)
async def list_trips(pg: Pagination = Depends(), db: AsyncSession = Depends(get_db)):
    query = select(Trip).offset(pg.offset).limit(pg.size)
    result = await db.execute(query)
    items = result.scalars().all()
    count_result = await db.execute(select(Trip.id))
    total = len(count_result.scalars().all())
    return {"items": items, "page": pg.page, "size": pg.size, "total": total}


@router.post("/", response_model=TripRead)
async def create_trip(trip_in: TripCreate, db: AsyncSession = Depends(get_db)):
    import uuid
    db_trip = Trip(
        id=str(uuid.uuid4()),
        **trip_in.model_dump(),
        revenue=0,
        status="Draft"
    )
    db.add(db_trip)
    await db.commit()
    await db.refresh(db_trip)
    return db_trip


@router.get("/{tid}", response_model=TripRead)
async def get_trip(tid: str, db: AsyncSession = Depends(get_db)):
    result = await db.execute(select(Trip).where(Trip.id == tid))
    trip = result.scalar_one_or_none()
    if not trip:
        raise HTTPException(status.HTTP_404_NOT_FOUND, "Trip not found")
    return trip


@router.post("/{tid}/dispatch", response_model=TripRead)
async def dispatch(tid: str, db: AsyncSession = Depends(get_db)):
    result = await db.execute(select(Trip).where(Trip.id == tid))
    trip = result.scalar_one_or_none()
    if not trip:
        raise HTTPException(status.HTTP_404_NOT_FOUND, "Trip not found")
    if trip.status != "Draft":
        raise HTTPException(status.HTTP_400_BAD_REQUEST, "Trip is not in Draft status")

    # Get vehicle and driver
    vehicle_result = await db.execute(select(Vehicle).where(Vehicle.id == trip.vehicle_id))
    vehicle = vehicle_result.scalar_one_or_none()
    driver_result = await db.execute(select(Driver).where(Driver.id == trip.driver_id))
    driver = driver_result.scalar_one_or_none()

    if not vehicle or vehicle.status != "Available":
        raise HTTPException(status.HTTP_400_BAD_REQUEST, "Vehicle not available")
    if not driver or driver.status != "Available":
        raise HTTPException(status.HTTP_400_BAD_REQUEST, "Driver not available")

    # Update statuses
    trip.status = "Dispatched"
    trip.dispatched_at = datetime.utcnow()
    vehicle.status = "On Trip"
    driver.status = "On Trip"

    await db.commit()
    await db.refresh(trip)
    return trip


@router.post("/{tid}/complete", response_model=TripRead)
async def complete(tid: str, completion: TripCompletion, db: AsyncSession = Depends(get_db)):
    result = await db.execute(select(Trip).where(Trip.id == tid))
    trip = result.scalar_one_or_none()
    if not trip:
        raise HTTPException(status.HTTP_404_NOT_FOUND, "Trip not found")
    if trip.status != "Dispatched":
        raise HTTPException(status.HTTP_400_BAD_REQUEST, "Trip is not in Dispatched status")

    # Get vehicle and driver
    vehicle_result = await db.execute(select(Vehicle).where(Vehicle.id == trip.vehicle_id))
    vehicle = vehicle_result.scalar_one_or_none()
    driver_result = await db.execute(select(Driver).where(Driver.id == trip.driver_id))
    driver = driver_result.scalar_one_or_none()

    # Update trip
    trip.status = "Completed"
    trip.actual_distance = completion.actual_distance
    trip.revenue = completion.revenue
    trip.completed_at = datetime.utcnow()

    # Update vehicle odometer and status
    if vehicle:
        vehicle.odometer += completion.actual_distance
        vehicle.status = "Available"

    # Update driver status
    if driver:
        driver.status = "Available"

    await db.commit()
    await db.refresh(trip)
    return trip


@router.post("/{tid}/cancel", response_model=TripRead)
async def cancel(tid: str, db: AsyncSession = Depends(get_db)):
    result = await db.execute(select(Trip).where(Trip.id == tid))
    trip = result.scalar_one_or_none()
    if not trip:
        raise HTTPException(status.HTTP_404_NOT_FOUND, "Trip not found")
    if trip.status not in ["Draft", "Dispatched"]:
        raise HTTPException(status.HTTP_400_BAD_REQUEST, "Trip cannot be cancelled")

    # If dispatched, set vehicle and driver back to available
    if trip.status == "Dispatched":
        vehicle_result = await db.execute(select(Vehicle).where(Vehicle.id == trip.vehicle_id))
        vehicle = vehicle_result.scalar_one_or_none()
        driver_result = await db.execute(select(Driver).where(Driver.id == trip.driver_id))
        driver = driver_result.scalar_one_or_none()
        if vehicle:
            vehicle.status = "Available"
        if driver:
            driver.status = "Available"

    trip.status = "Cancelled"
    await db.commit()
    await db.refresh(trip)
    return trip

=======
from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session

from app.api.v1.deps import require_perm
from app.db.session import get_db
from app.schemas.trip import TripComplete, TripCreate, TripOut, TripUpdate
from app.services import trip_service

router = APIRouter(prefix="/trips", tags=["trips"])


@router.get("", response_model=list[TripOut])
def list_trips(status: str | None = None, db: Session = Depends(get_db), user=Depends(require_perm("trip", "read"))):
    return trip_service.list_trips(db, status)


@router.get("/{trip_id}", response_model=TripOut)
def get_trip(trip_id: int, db: Session = Depends(get_db), user=Depends(require_perm("trip", "read"))):
    return trip_service.get_trip(db, trip_id)


@router.post("", response_model=TripOut)
def create_trip(data: TripCreate, db: Session = Depends(get_db), user=Depends(require_perm("trip", "create"))):
    return trip_service.create_trip(db, data, user.user_id)


@router.put("/{trip_id}", response_model=TripOut)
def update_trip(trip_id: int, data: TripUpdate, db: Session = Depends(get_db), user=Depends(require_perm("trip", "update"))):
    return trip_service.update_trip(db, trip_id, data, user.user_id)


@router.post("/{trip_id}/dispatch", response_model=TripOut)
def dispatch_trip(trip_id: int, db: Session = Depends(get_db), user=Depends(require_perm("trip", "update"))):
    return trip_service.dispatch_trip(db, trip_id, user.user_id)


@router.post("/{trip_id}/complete", response_model=TripOut)
def complete_trip(trip_id: int, data: TripComplete, db: Session = Depends(get_db), user=Depends(require_perm("trip", "update"))):
    return trip_service.complete_trip(db, trip_id, data, user.user_id)


@router.post("/{trip_id}/cancel", response_model=TripOut)
def cancel_trip(trip_id: int, db: Session = Depends(get_db), user=Depends(require_perm("trip", "update"))):
    return trip_service.cancel_trip(db, trip_id, user.user_id)
>>>>>>> e21946685e62ae18c3f3933d86dd20bdbac55cd8
