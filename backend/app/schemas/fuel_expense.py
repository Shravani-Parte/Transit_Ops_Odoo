from decimal import Decimal
from datetime import datetime
from pydantic import BaseModel


class FuelLogCreate(BaseModel):
    vehicle_id: str
    trip_id: str | None = None
    liters: Decimal
    cost: Decimal
    odometer: Decimal | None = None


class FuelLogRead(FuelLogCreate):
    id: str
    logged_at: datetime

    class Config:
        from_attributes = True


class ExpenseCreate(BaseModel):
    vehicle_id: str | None = None
    trip_id: str | None = None
    category: str
    amount: Decimal
    notes: str | None = None


class ExpenseRead(ExpenseCreate):
    id: str
    incurred_at: datetime

    class Config:
        from_attributes = True
