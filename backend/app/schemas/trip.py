<<<<<<< HEAD
from decimal import Decimal
from datetime import datetime
=======
from datetime import datetime
from decimal import Decimal
from typing import Optional
>>>>>>> e21946685e62ae18c3f3933d86dd20bdbac55cd8
from pydantic import BaseModel


class TripBase(BaseModel):
    source: str
    destination: str
<<<<<<< HEAD
    vehicle_id: str
    driver_id: str
    cargo_weight: Decimal
    planned_distance: Decimal
=======
    vehicle_id: int
    driver_id: int
    cargo_weight: Decimal
    planned_distance: Decimal
    revenue: Decimal = Decimal("0")
>>>>>>> e21946685e62ae18c3f3933d86dd20bdbac55cd8


class TripCreate(TripBase):
    pass


<<<<<<< HEAD
class TripCompletion(BaseModel):
    actual_distance: Decimal
    revenue: Decimal = Decimal(0)


class TripRead(TripBase):
    id: str
    actual_distance: Decimal | None
    revenue: Decimal
    status: str
    dispatched_at: datetime | None
    completed_at: datetime | None
=======
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
>>>>>>> e21946685e62ae18c3f3933d86dd20bdbac55cd8

    class Config:
        from_attributes = True
