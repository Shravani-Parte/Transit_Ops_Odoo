<<<<<<< HEAD
from decimal import Decimal
from datetime import datetime
=======
from datetime import date, datetime
from decimal import Decimal
from typing import Optional
>>>>>>> e21946685e62ae18c3f3933d86dd20bdbac55cd8
from pydantic import BaseModel


class FuelLogCreate(BaseModel):
<<<<<<< HEAD
    vehicle_id: str
    trip_id: str | None = None
    liters: Decimal
    cost: Decimal
    odometer: Decimal | None = None


class FuelLogRead(FuelLogCreate):
    id: str
    logged_at: datetime
=======
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
>>>>>>> e21946685e62ae18c3f3933d86dd20bdbac55cd8

    class Config:
        from_attributes = True


class ExpenseCreate(BaseModel):
<<<<<<< HEAD
    vehicle_id: str | None = None
    trip_id: str | None = None
    category: str
    amount: Decimal
    notes: str | None = None


class ExpenseRead(ExpenseCreate):
    id: str
    incurred_at: datetime
=======
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
>>>>>>> e21946685e62ae18c3f3933d86dd20bdbac55cd8

    class Config:
        from_attributes = True
