from datetime import datetime
from decimal import Decimal
from typing import Optional
from pydantic import BaseModel


class MaintenanceCreate(BaseModel):
    vehicle_id: int
    maintenance_type: str
    description: Optional[str] = None
    cost: Decimal = Decimal("0")


class MaintenanceOut(BaseModel):
    maintenance_id: int
    vehicle_id: int
    vehicle_name: Optional[str] = None
    maintenance_type: str
    description: Optional[str] = None
    cost: Decimal
    status: str
    opened_at: Optional[datetime] = None
    closed_at: Optional[datetime] = None

    class Config:
        from_attributes = True
