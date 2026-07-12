<<<<<<< HEAD
"""fuel_expense_service — primary business-rule enforcement layer.

DB triggers in database/triggers_views.sql provide a second, defense-in-depth
layer (per resolved diff #5) — not the primary one.
"""
from typing import Any


class Fuel_expenseService:
    """Placeholder — wire up when the runtime is connected."""

    async def list(self, *args: Any, **kwargs: Any) -> list:
        return []

    async def get(self, entity_id: str) -> Any | None:
        return None

    async def create(self, data: Any) -> Any:
        raise NotImplementedError

    async def update(self, entity_id: str, data: Any) -> Any:
        raise NotImplementedError

    async def delete(self, entity_id: str) -> None:
        raise NotImplementedError
=======
from sqlalchemy.orm import Session

from app.core.exceptions import NotFoundError
from app.models.expense import Expense
from app.models.fuel_log import FuelLog
from app.models.vehicle import Vehicle
from app.schemas.fuel_expense import ExpenseCreate, FuelLogCreate


def fuel_log_to_dict(db: Session, log: FuelLog) -> dict:
    vehicle = db.query(Vehicle).filter(Vehicle.vehicle_id == log.vehicle_id).first()
    return {
        "fuel_log_id": log.fuel_log_id,
        "vehicle_id": log.vehicle_id,
        "trip_id": log.trip_id,
        "liters": log.liters,
        "cost": log.cost,
        "log_date": log.log_date,
        "vehicle_name": vehicle.vehicle_name if vehicle else None,
        "created_at": log.created_at,
    }


def expense_to_dict(db: Session, exp: Expense) -> dict:
    vehicle = db.query(Vehicle).filter(Vehicle.vehicle_id == exp.vehicle_id).first()
    return {
        "expense_id": exp.expense_id,
        "vehicle_id": exp.vehicle_id,
        "trip_id": exp.trip_id,
        "expense_type": exp.expense_type,
        "amount": exp.amount,
        "expense_date": exp.expense_date,
        "description": exp.description,
        "vehicle_name": vehicle.vehicle_name if vehicle else None,
        "created_at": exp.created_at,
    }


def list_fuel_logs(db: Session, vehicle_id: int | None = None) -> list[dict]:
    q = db.query(FuelLog)
    if vehicle_id:
        q = q.filter(FuelLog.vehicle_id == vehicle_id)
    return [fuel_log_to_dict(db, f) for f in q.order_by(FuelLog.log_date.desc()).all()]


def create_fuel_log(db: Session, data: FuelLogCreate, user_id: int) -> dict:
    vehicle = db.query(Vehicle).filter(Vehicle.vehicle_id == data.vehicle_id).first()
    if not vehicle:
        raise NotFoundError("Vehicle not found")
    log = FuelLog(recorded_by=user_id, **data.model_dump())
    db.add(log)
    db.commit()
    db.refresh(log)
    return fuel_log_to_dict(db, log)


def list_expenses(db: Session, vehicle_id: int | None = None, expense_type: str | None = None) -> list[dict]:
    q = db.query(Expense)
    if vehicle_id:
        q = q.filter(Expense.vehicle_id == vehicle_id)
    if expense_type:
        q = q.filter(Expense.expense_type == expense_type)
    return [expense_to_dict(db, e) for e in q.order_by(Expense.expense_date.desc()).all()]


def create_expense(db: Session, data: ExpenseCreate, user_id: int) -> dict:
    vehicle = db.query(Vehicle).filter(Vehicle.vehicle_id == data.vehicle_id).first()
    if not vehicle:
        raise NotFoundError("Vehicle not found")
    exp = Expense(recorded_by=user_id, **data.model_dump())
    db.add(exp)
    db.commit()
    db.refresh(exp)
    return expense_to_dict(db, exp)
>>>>>>> e21946685e62ae18c3f3933d86dd20bdbac55cd8
