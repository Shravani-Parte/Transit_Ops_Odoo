from datetime import date, datetime
from decimal import Decimal
from typing import Optional
from pydantic import BaseModel


class FuelLogCreate(BaseModel):
    vehicle_id: int
    trip_id: Optional[int] = None
    liters: Decimal
    cost: Decimal
    log_date: date


class FuelLogOut(BaseModel):
    fuel_log_id: int
    vehicle_id: int
    trip_id: Optional[int]
    liters: Decimal
    cost: Decimal
    log_date: date
    vehicle_name: Optional[str] = None
    created_at: Optional[datetime] = None

    class Config:
        from_attributes = True


class ExpenseCreate(BaseModel):
    vehicle_id: int
    trip_id: Optional[int] = None
    expense_type: str
    amount: Decimal
    expense_date: date
    description: Optional[str] = None


class ExpenseOut(BaseModel):
    expense_id: int
    vehicle_id: int
    trip_id: Optional[int]
    expense_type: str
    amount: Decimal
    expense_date: date
    description: Optional[str] = None
    vehicle_name: Optional[str] = None
    created_at: Optional[datetime] = None

    class Config:
        from_attributes = True
