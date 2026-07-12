<<<<<<< HEAD
"""trip_service — trip lifecycle + validation.

Rules enforced here (primary layer; DB triggers mirror as defense-in-depth):
  - Cargo weight <= vehicle.max_load_capacity
  - Vehicle status must be Available (never In Shop, Retired, On Trip)
  - Driver status must be Available and license not expired and not Suspended
  - Dispatch atomically flips vehicle.status -> On Trip and driver.status -> On Trip
  - Complete/Cancel atomically returns both to Available
  - Every state change writes a trip_status_history entry
  - Re-validate at dispatch time (values may have changed since Draft)
"""
from typing import Any


class TripService:
    async def create_draft(self, payload: Any) -> Any:
        raise NotImplementedError

    async def dispatch(self, trip_id: str) -> Any:
        raise NotImplementedError

    async def complete(self, trip_id: str, payload: Any) -> Any:
        raise NotImplementedError

    async def cancel(self, trip_id: str, reason: str | None) -> Any:
        raise NotImplementedError
=======
from datetime import date, datetime, timezone
from decimal import Decimal

from sqlalchemy.orm import Session

from app.core.exceptions import NotFoundError, ValidationError
from app.models.driver import Driver
from app.models.driver_status_history import DriverStatusHistory
from app.models.fuel_log import FuelLog
from app.models.trip import Trip
from app.models.trip_status_history import TripStatusHistory
from app.models.vehicle import Vehicle
from app.models.vehicle_status_history import VehicleStatusHistory
from app.schemas.trip import TripComplete, TripCreate, TripUpdate


def _generate_trip_code(db: Session) -> str:
    count = db.query(Trip).count()
    return f"TRIP-{count + 1:06d}"


def trip_to_dict(db: Session, trip: Trip) -> dict:
    vehicle = db.query(Vehicle).filter(Vehicle.vehicle_id == trip.vehicle_id).first()
    driver = db.query(Driver).filter(Driver.driver_id == trip.driver_id).first()
    return {
        "trip_id": trip.trip_id,
        "trip_code": trip.trip_code,
        "source": trip.source,
        "destination": trip.destination,
        "vehicle_id": trip.vehicle_id,
        "driver_id": trip.driver_id,
        "cargo_weight": trip.cargo_weight,
        "planned_distance": trip.planned_distance,
        "actual_distance": trip.actual_distance,
        "starting_odometer": trip.starting_odometer,
        "final_odometer": trip.final_odometer,
        "fuel_consumed": trip.fuel_consumed,
        "revenue": trip.revenue,
        "status": trip.status,
        "vehicle_name": vehicle.vehicle_name if vehicle else None,
        "driver_name": driver.full_name if driver else None,
        "dispatched_at": trip.dispatched_at,
        "completed_at": trip.completed_at,
        "created_at": trip.created_at,
    }


def _validate_dispatch(db: Session, trip: Trip) -> None:
    vehicle = db.query(Vehicle).filter(Vehicle.vehicle_id == trip.vehicle_id).first()
    driver = db.query(Driver).filter(Driver.driver_id == trip.driver_id).first()
    if not vehicle or not driver:
        raise ValidationError("Invalid vehicle or driver")
    if vehicle.status not in ("Available",):
        raise ValidationError(f"Vehicle is {vehicle.status}, not Available")
    if vehicle.status in ("Retired", "In Shop"):
        raise ValidationError("Retired or In Shop vehicles cannot be dispatched")
    if driver.status != "Available":
        raise ValidationError(f"Driver is {driver.status}, not Available")
    if driver.license_expiry_date < date.today():
        raise ValidationError("Driver license is expired")
    if driver.status == "Suspended":
        raise ValidationError("Suspended drivers cannot be assigned")
    if trip.cargo_weight > vehicle.max_load_capacity:
        raise ValidationError("Cargo weight exceeds vehicle max load capacity")


def list_trips(db: Session, status: str | None = None) -> list[dict]:
    q = db.query(Trip)
    if status:
        q = q.filter(Trip.status == status)
    return [trip_to_dict(db, t) for t in q.order_by(Trip.trip_id.desc()).all()]


def get_trip(db: Session, trip_id: int) -> dict:
    trip = db.query(Trip).filter(Trip.trip_id == trip_id).first()
    if not trip:
        raise NotFoundError("Trip not found")
    return trip_to_dict(db, trip)


def create_trip(db: Session, data: TripCreate, user_id: int) -> dict:
    vehicle = db.query(Vehicle).filter(Vehicle.vehicle_id == data.vehicle_id).first()
    if not vehicle:
        raise ValidationError("Vehicle not found")
    if data.cargo_weight > vehicle.max_load_capacity:
        raise ValidationError("Cargo weight exceeds vehicle max load capacity")
    trip = Trip(trip_code=_generate_trip_code(db), created_by=user_id, **data.model_dump())
    db.add(trip)
    db.flush()
    db.add(TripStatusHistory(trip_id=trip.trip_id, old_status=None, new_status="Draft", changed_by=user_id))
    db.commit()
    db.refresh(trip)
    return trip_to_dict(db, trip)


def update_trip(db: Session, trip_id: int, data: TripUpdate, user_id: int) -> dict:
    trip = db.query(Trip).filter(Trip.trip_id == trip_id).first()
    if not trip:
        raise NotFoundError("Trip not found")
    if trip.status != "Draft":
        raise ValidationError("Only draft trips can be updated")
    for k, v in data.model_dump(exclude_unset=True).items():
        setattr(trip, k, v)
    if data.cargo_weight or data.vehicle_id:
        vehicle = db.query(Vehicle).filter(Vehicle.vehicle_id == trip.vehicle_id).first()
        if trip.cargo_weight > vehicle.max_load_capacity:
            raise ValidationError("Cargo weight exceeds vehicle max load capacity")
    db.commit()
    db.refresh(trip)
    return trip_to_dict(db, trip)


def dispatch_trip(db: Session, trip_id: int, user_id: int) -> dict:
    trip = db.query(Trip).filter(Trip.trip_id == trip_id).first()
    if not trip:
        raise NotFoundError("Trip not found")
    if trip.status != "Draft":
        raise ValidationError("Only draft trips can be dispatched")
    _validate_dispatch(db, trip)

    vehicle = db.query(Vehicle).filter(Vehicle.vehicle_id == trip.vehicle_id).first()
    driver = db.query(Driver).filter(Driver.driver_id == trip.driver_id).first()

    old_v_status, old_d_status = vehicle.status, driver.status
    trip.status = "Dispatched"
    trip.dispatched_at = datetime.now(timezone.utc)
    trip.starting_odometer = vehicle.odometer
    vehicle.status = "On Trip"
    driver.status = "On Trip"

    db.add(TripStatusHistory(trip_id=trip.trip_id, old_status="Draft", new_status="Dispatched", changed_by=user_id))
    db.add(VehicleStatusHistory(vehicle_id=vehicle.vehicle_id, old_status=old_v_status, new_status="On Trip", changed_by=user_id, reason=f"Trip {trip.trip_code} dispatched"))
    db.add(DriverStatusHistory(driver_id=driver.driver_id, old_status=old_d_status, new_status="On Trip", changed_by=user_id, reason=f"Trip {trip.trip_code} dispatched"))
    db.commit()
    db.refresh(trip)
    return trip_to_dict(db, trip)


def complete_trip(db: Session, trip_id: int, data: TripComplete, user_id: int) -> dict:
    trip = db.query(Trip).filter(Trip.trip_id == trip_id).first()
    if not trip:
        raise NotFoundError("Trip not found")
    if trip.status != "Dispatched":
        raise ValidationError("Only dispatched trips can be completed")

    vehicle = db.query(Vehicle).filter(Vehicle.vehicle_id == trip.vehicle_id).first()
    driver = db.query(Driver).filter(Driver.driver_id == trip.driver_id).first()

    trip.status = "Completed"
    trip.completed_at = datetime.now(timezone.utc)
    trip.final_odometer = data.final_odometer
    trip.actual_distance = data.actual_distance
    trip.fuel_consumed = data.fuel_consumed
    if data.revenue is not None:
        trip.revenue = data.revenue

    old_v_status, old_d_status = vehicle.status, driver.status
    vehicle.status = "Available"
    vehicle.odometer = data.final_odometer
    driver.status = "Available"

    db.add(TripStatusHistory(trip_id=trip.trip_id, old_status="Dispatched", new_status="Completed", changed_by=user_id))
    db.add(VehicleStatusHistory(vehicle_id=vehicle.vehicle_id, old_status=old_v_status, new_status="Available", changed_by=user_id, reason=f"Trip {trip.trip_code} completed"))
    db.add(DriverStatusHistory(driver_id=driver.driver_id, old_status=old_d_status, new_status="Available", changed_by=user_id, reason=f"Trip {trip.trip_code} completed"))

    if data.fuel_consumed > 0:
        db.add(FuelLog(
            vehicle_id=trip.vehicle_id,
            trip_id=trip.trip_id,
            liters=data.fuel_consumed,
            cost=data.fuel_cost,
            log_date=date.today(),
            recorded_by=user_id,
        ))

    db.commit()
    db.refresh(trip)
    return trip_to_dict(db, trip)


def cancel_trip(db: Session, trip_id: int, user_id: int) -> dict:
    trip = db.query(Trip).filter(Trip.trip_id == trip_id).first()
    if not trip:
        raise NotFoundError("Trip not found")

    if trip.status == "Draft":
        trip.status = "Cancelled"
        trip.cancelled_at = datetime.now(timezone.utc)
        db.add(TripStatusHistory(trip_id=trip.trip_id, old_status="Draft", new_status="Cancelled", changed_by=user_id))
    elif trip.status == "Dispatched":
        vehicle = db.query(Vehicle).filter(Vehicle.vehicle_id == trip.vehicle_id).first()
        driver = db.query(Driver).filter(Driver.driver_id == trip.driver_id).first()
        old_v_status, old_d_status = vehicle.status, driver.status
        trip.status = "Cancelled"
        trip.cancelled_at = datetime.now(timezone.utc)
        vehicle.status = "Available"
        driver.status = "Available"
        db.add(TripStatusHistory(trip_id=trip.trip_id, old_status="Dispatched", new_status="Cancelled", changed_by=user_id))
        db.add(VehicleStatusHistory(vehicle_id=vehicle.vehicle_id, old_status=old_v_status, new_status="Available", changed_by=user_id, reason=f"Trip {trip.trip_code} cancelled"))
        db.add(DriverStatusHistory(driver_id=driver.driver_id, old_status=old_d_status, new_status="Available", changed_by=user_id, reason=f"Trip {trip.trip_code} cancelled"))
    else:
        raise ValidationError("Cannot cancel completed trip")

    db.commit()
    db.refresh(trip)
    return trip_to_dict(db, trip)
>>>>>>> e21946685e62ae18c3f3933d86dd20bdbac55cd8
