from datetime import datetime
from decimal import Decimal
from typing import Optional
from pydantic import BaseModel


class TripBase(BaseModel):
    source: str
    destination: str
    vehicle_id: int
    driver_id: int
    cargo_weight: Decimal
    planned_distance: Decimal
    revenue: Decimal = Decimal("0")


class TripCreate(TripBase):
    pass


class TripUpdate(BaseModel):
    source: Optional[str] = None
    destination: Optional[str] = None
    vehicle_id: Optional[int] = None
    driver_id: Optional[int] = None
    cargo_weight: Optional[Decimal] = None
    planned_distance: Optional[Decimal] = None
    revenue: Optional[Decimal] = None


class TripComplete(BaseModel):
    final_odometer: Decimal
    actual_distance: Decimal
    fuel_consumed: Decimal
    fuel_cost: Decimal
    revenue: Optional[Decimal] = None


class TripOut(TripBase):
    trip_id: int
    trip_code: str
    status: str
    actual_distance: Optional[Decimal] = None
    starting_odometer: Optional[Decimal] = None
    final_odometer: Optional[Decimal] = None
    fuel_consumed: Optional[Decimal] = None
    vehicle_name: Optional[str] = None
    driver_name: Optional[str] = None
    dispatched_at: Optional[datetime] = None
    completed_at: Optional[datetime] = None
    created_at: Optional[datetime] = None

    class Config:
        from_attributes = True
