from datetime import datetime
from decimal import Decimal
from typing import Optional
from pydantic import BaseModel, Field


class VehicleBase(BaseModel):
    registration_number: str
    vehicle_name: str
    vehicle_type: str
    max_load_capacity: Decimal
    odometer: Decimal = Decimal("0")
    acquisition_cost: Decimal
    region_id: Optional[int] = None
    status: str = "Available"


class VehicleCreate(VehicleBase):
    pass


class VehicleUpdate(BaseModel):
    vehicle_name: Optional[str] = None
    vehicle_type: Optional[str] = None
    max_load_capacity: Optional[Decimal] = None
    odometer: Optional[Decimal] = None
    acquisition_cost: Optional[Decimal] = None
    region_id: Optional[int] = None
    status: Optional[str] = None


class VehicleOut(VehicleBase):
    vehicle_id: int
    region_name: Optional[str] = None
    created_at: Optional[datetime] = None

    class Config:
        from_attributes = True


class VehicleStatusHistoryOut(BaseModel):
    history_id: int
    old_status: Optional[str]
    new_status: str
    reason: Optional[str]
    changed_at: Optional[datetime]

    class Config:
        from_attributes = True
