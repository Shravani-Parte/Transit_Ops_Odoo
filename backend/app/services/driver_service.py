from datetime import date
from decimal import Decimal

from sqlalchemy.orm import Session

from app.core.exceptions import NotFoundError, ValidationError
from app.models.driver import Driver
from app.models.driver_status_history import DriverStatusHistory
from app.models.trip import Trip
from app.schemas.driver import DriverCreate, DriverUpdate


def _is_license_valid(driver: Driver) -> bool:
    return driver.license_expiry_date >= date.today()


def driver_to_dict(db: Session, driver: Driver) -> dict:
    return {
        "driver_id": driver.driver_id,
        "full_name": driver.full_name,
        "license_number": driver.license_number,
        "license_category": driver.license_category,
        "license_expiry_date": driver.license_expiry_date,
        "contact_number": driver.contact_number,
        "safety_score": driver.safety_score,
        "status": driver.status,
        "license_valid": _is_license_valid(driver),
        "created_at": driver.created_at,
    }


def list_drivers(db: Session, status: str | None = None, search: str | None = None) -> list[dict]:
    q = db.query(Driver).filter(Driver.is_deleted == False)
    if status:
        q = q.filter(Driver.status == status)
    if search:
        q = q.filter(Driver.full_name.ilike(f"%{search}%"))
    return [driver_to_dict(db, d) for d in q.order_by(Driver.driver_id).all()]


def get_available_drivers(db: Session) -> list[dict]:
    today = date.today()
    drivers = (
        db.query(Driver)
        .filter(
            Driver.is_deleted == False,
            Driver.status == "Available",
            Driver.license_expiry_date >= today,
        )
        .all()
    )
    return [driver_to_dict(db, d) for d in drivers]


def get_driver(db: Session, driver_id: int) -> dict:
    driver = db.query(Driver).filter(Driver.driver_id == driver_id, Driver.is_deleted == False).first()
    if not driver:
        raise NotFoundError("Driver not found")
    return driver_to_dict(db, driver)


def create_driver(db: Session, data: DriverCreate, user_id: int) -> dict:
    existing = db.query(Driver).filter(Driver.license_number == data.license_number).first()
    if existing:
        raise ValidationError("License number already exists")
    driver = Driver(**data.model_dump())
    db.add(driver)
    db.flush()
    db.add(DriverStatusHistory(driver_id=driver.driver_id, old_status=None, new_status=driver.status, changed_by=user_id, reason="Driver created"))
    db.commit()
    db.refresh(driver)
    return driver_to_dict(db, driver)


def update_driver(db: Session, driver_id: int, data: DriverUpdate, user_id: int) -> dict:
    driver = db.query(Driver).filter(Driver.driver_id == driver_id, Driver.is_deleted == False).first()
    if not driver:
        raise NotFoundError("Driver not found")
    old_status = driver.status
    for k, v in data.model_dump(exclude_unset=True).items():
        setattr(driver, k, v)
    if data.status and data.status != old_status:
        db.add(DriverStatusHistory(driver_id=driver.driver_id, old_status=old_status, new_status=driver.status, changed_by=user_id, reason="Status updated"))
    db.commit()
    db.refresh(driver)
    return driver_to_dict(db, driver)


def delete_driver(db: Session, driver_id: int) -> None:
    driver = db.query(Driver).filter(Driver.driver_id == driver_id).first()
    if not driver:
        raise NotFoundError("Driver not found")
    active_trip = db.query(Trip).filter(Trip.driver_id == driver_id, Trip.status == "Dispatched").first()
    if active_trip:
        raise ValidationError("Cannot delete driver on active trip")
    driver.is_deleted = True
    db.commit()


def get_status_history(db: Session, driver_id: int) -> list:
    return (
        db.query(DriverStatusHistory)
        .filter(DriverStatusHistory.driver_id == driver_id)
        .order_by(DriverStatusHistory.changed_at.desc())
        .all()
    )
