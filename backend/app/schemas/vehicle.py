from decimal import Decimal
from datetime import datetime
from pydantic import BaseModel


class VehicleBase(BaseModel):
    registration_number: str
    name_model: str
    type: str
    max_load_capacity: Decimal
    acquisition_cost: Decimal = Decimal(0)
    region_id: str | None = None


class VehicleCreate(VehicleBase):
    pass


class VehicleUpdate(BaseModel):
    name_model: str | None = None
    type: str | None = None
    max_load_capacity: Decimal | None = None
    acquisition_cost: Decimal | None = None
    region_id: str | None = None


class VehicleRead(VehicleBase):
    id: str
    odometer: Decimal
    status: str
    created_at: datetime

    class Config:
        from_attributes = True
