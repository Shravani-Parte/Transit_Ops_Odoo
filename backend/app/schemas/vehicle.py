<<<<<<< HEAD
from decimal import Decimal
from datetime import datetime
=======
from datetime import datetime, date
from decimal import Decimal
from typing import Optional
>>>>>>> e21946685e62ae18c3f3933d86dd20bdbac55cd8
from pydantic import BaseModel


class VehicleBase(BaseModel):
    registration_number: str
<<<<<<< HEAD
    name_model: str
    type: str
    max_load_capacity: Decimal
    acquisition_cost: Decimal = Decimal(0)
    region_id: str | None = None
=======
    vehicle_name: str
    vehicle_type: str
    max_load_capacity: Decimal
    odometer: Decimal = Decimal("0")
    acquisition_cost: Decimal
    region_id: Optional[int] = None
    status: str = "Available"
>>>>>>> e21946685e62ae18c3f3933d86dd20bdbac55cd8


class VehicleCreate(VehicleBase):
    pass


class VehicleUpdate(BaseModel):
<<<<<<< HEAD
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
=======
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


class VehicleDocumentBase(BaseModel):
    document_type: str
    file_url: str
    expiry_date: Optional[date] = None


class VehicleDocumentCreate(VehicleDocumentBase):
    pass


class VehicleDocumentOut(VehicleDocumentBase):
    document_id: int
    vehicle_id: int
    uploaded_at: Optional[datetime] = None

    class Config:
        from_attributes = True


class VehicleCostSummary(BaseModel):
    total_fuel_cost: Decimal
    total_maintenance_cost: Decimal
    total_cost: Decimal

>>>>>>> e21946685e62ae18c3f3933d86dd20bdbac55cd8
