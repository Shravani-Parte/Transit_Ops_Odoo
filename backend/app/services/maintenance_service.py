<<<<<<< HEAD
"""maintenance_service — open/close ↔ vehicle status sync.

Opening a maintenance record moves vehicle Available -> In Shop.
Closing a maintenance record returns vehicle In Shop -> Available,
unless it was Retired during the window.
Trying to open maintenance on an On Trip vehicle is rejected.
"""
from typing import Any


class MaintenanceService:
    async def open(self, payload: Any) -> Any:
        raise NotImplementedError

    async def close(self, log_id: str, payload: Any) -> Any:
        raise NotImplementedError
=======
from datetime import datetime, timezone

from sqlalchemy.orm import Session

from app.core.exceptions import NotFoundError, ValidationError
from app.models.maintenance_log import MaintenanceLog
from app.models.trip import Trip
from app.models.vehicle import Vehicle
from app.models.vehicle_status_history import VehicleStatusHistory
from app.schemas.maintenance import MaintenanceCreate


def maintenance_to_dict(db: Session, log: MaintenanceLog) -> dict:
    vehicle = db.query(Vehicle).filter(Vehicle.vehicle_id == log.vehicle_id).first()
    return {
        "maintenance_id": log.maintenance_id,
        "vehicle_id": log.vehicle_id,
        "vehicle_name": vehicle.vehicle_name if vehicle else None,
        "maintenance_type": log.maintenance_type,
        "description": log.description,
        "cost": log.cost,
        "status": log.status,
        "opened_at": log.opened_at,
        "closed_at": log.closed_at,
    }


def list_maintenance(db: Session, status: str | None = None) -> list[dict]:
    q = db.query(MaintenanceLog)
    if status:
        q = q.filter(MaintenanceLog.status == status)
    return [maintenance_to_dict(db, m) for m in q.order_by(MaintenanceLog.maintenance_id.desc()).all()]


def create_maintenance(db: Session, data: MaintenanceCreate, user_id: int) -> dict:
    vehicle = db.query(Vehicle).filter(Vehicle.vehicle_id == data.vehicle_id).first()
    if not vehicle:
        raise NotFoundError("Vehicle not found")
    if vehicle.status == "On Trip":
        raise ValidationError("Cannot open maintenance for vehicle on trip")
    if vehicle.status == "Retired":
        raise ValidationError("Cannot open maintenance for retired vehicle")

    old_status = vehicle.status
    log = MaintenanceLog(created_by=user_id, **data.model_dump())
    db.add(log)
    vehicle.status = "In Shop"
    db.add(VehicleStatusHistory(vehicle_id=vehicle.vehicle_id, old_status=old_status, new_status="In Shop", changed_by=user_id, reason="Maintenance opened"))
    db.commit()
    db.refresh(log)
    return maintenance_to_dict(db, log)


def close_maintenance(db: Session, maintenance_id: int, user_id: int) -> dict:
    log = db.query(MaintenanceLog).filter(MaintenanceLog.maintenance_id == maintenance_id).first()
    if not log:
        raise NotFoundError("Maintenance record not found")
    if log.status == "Closed":
        raise ValidationError("Maintenance already closed")

    vehicle = db.query(Vehicle).filter(Vehicle.vehicle_id == log.vehicle_id).first()
    log.status = "Closed"
    log.closed_at = datetime.now(timezone.utc)

    if vehicle.status != "Retired":
        old_status = vehicle.status
        vehicle.status = "Available"
        db.add(VehicleStatusHistory(vehicle_id=vehicle.vehicle_id, old_status=old_status, new_status="Available", changed_by=user_id, reason="Maintenance closed"))

    db.commit()
    db.refresh(log)
    return maintenance_to_dict(db, log)
>>>>>>> e21946685e62ae18c3f3933d86dd20bdbac55cd8
