from decimal import Decimal
from datetime import datetime
from pydantic import BaseModel


class TripBase(BaseModel):
    source: str
    destination: str
    vehicle_id: str
    driver_id: str
    cargo_weight: Decimal
    planned_distance: Decimal


class TripCreate(TripBase):
    pass


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

    class Config:
        from_attributes = True
