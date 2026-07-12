from decimal import Decimal

from sqlalchemy.orm import Session

from app.core.exceptions import NotFoundError, ValidationError
from app.models.region import Region
from app.models.trip import Trip
from app.models.vehicle import Vehicle
from app.models.vehicle_status_history import VehicleStatusHistory
from app.schemas.vehicle import VehicleCreate, VehicleUpdate


def vehicle_to_dict(db: Session, vehicle: Vehicle) -> dict:
    region_name = None
    if vehicle.region_id:
        region = db.query(Region).filter(Region.region_id == vehicle.region_id).first()
        region_name = region.region_name if region else None
    return {
        "vehicle_id": vehicle.vehicle_id,
        "registration_number": vehicle.registration_number,
        "vehicle_name": vehicle.vehicle_name,
        "vehicle_type": vehicle.vehicle_type,
        "max_load_capacity": vehicle.max_load_capacity,
        "odometer": vehicle.odometer,
        "acquisition_cost": vehicle.acquisition_cost,
        "region_id": vehicle.region_id,
        "region_name": region_name,
        "status": vehicle.status,
        "created_at": vehicle.created_at,
    }


def list_vehicles(db: Session, status: str | None = None, vehicle_type: str | None = None, region_id: int | None = None, search: str | None = None) -> list[dict]:
    q = db.query(Vehicle).filter(Vehicle.is_deleted == False)
    if status:
        q = q.filter(Vehicle.status == status)
    if vehicle_type:
        q = q.filter(Vehicle.vehicle_type == vehicle_type)
    if region_id:
        q = q.filter(Vehicle.region_id == region_id)
    if search:
        q = q.filter(Vehicle.registration_number.ilike(f"%{search}%") | Vehicle.vehicle_name.ilike(f"%{search}%"))
    return [vehicle_to_dict(db, v) for v in q.order_by(Vehicle.vehicle_id).all()]


def get_available_vehicles(db: Session) -> list[dict]:
    vehicles = db.query(Vehicle).filter(Vehicle.is_deleted == False, Vehicle.status == "Available").all()
    return [vehicle_to_dict(db, v) for v in vehicles]


def get_vehicle(db: Session, vehicle_id: int) -> dict:
    vehicle = db.query(Vehicle).filter(Vehicle.vehicle_id == vehicle_id, Vehicle.is_deleted == False).first()
    if not vehicle:
        raise NotFoundError("Vehicle not found")
    return vehicle_to_dict(db, vehicle)


def create_vehicle(db: Session, data: VehicleCreate, user_id: int) -> dict:
    existing = db.query(Vehicle).filter(Vehicle.registration_number == data.registration_number).first()
    if existing:
        raise ValidationError("Registration number already exists")
    vehicle = Vehicle(**data.model_dump())
    db.add(vehicle)
    db.flush()
    db.add(VehicleStatusHistory(vehicle_id=vehicle.vehicle_id, old_status=None, new_status=vehicle.status, changed_by=user_id, reason="Vehicle registered"))
    db.commit()
    db.refresh(vehicle)
    return vehicle_to_dict(db, vehicle)


def update_vehicle(db: Session, vehicle_id: int, data: VehicleUpdate, user_id: int) -> dict:
    vehicle = db.query(Vehicle).filter(Vehicle.vehicle_id == vehicle_id, Vehicle.is_deleted == False).first()
    if not vehicle:
        raise NotFoundError("Vehicle not found")
    old_status = vehicle.status
    for k, v in data.model_dump(exclude_unset=True).items():
        setattr(vehicle, k, v)
    if data.status and data.status != old_status:
        db.add(VehicleStatusHistory(vehicle_id=vehicle.vehicle_id, old_status=old_status, new_status=vehicle.status, changed_by=user_id, reason="Status updated"))
    db.commit()
    db.refresh(vehicle)
    return vehicle_to_dict(db, vehicle)


def delete_vehicle(db: Session, vehicle_id: int) -> None:
    vehicle = db.query(Vehicle).filter(Vehicle.vehicle_id == vehicle_id).first()
    if not vehicle:
        raise NotFoundError("Vehicle not found")
    active_trip = db.query(Trip).filter(Trip.vehicle_id == vehicle_id, Trip.status == "Dispatched").first()
    if active_trip:
        raise ValidationError("Cannot delete vehicle on active trip")
    vehicle.is_deleted = True
    db.commit()


def get_status_history(db: Session, vehicle_id: int) -> list:
    return (
        db.query(VehicleStatusHistory)
        .filter(VehicleStatusHistory.vehicle_id == vehicle_id)
        .order_by(VehicleStatusHistory.changed_at.desc())
        .all()
    )
