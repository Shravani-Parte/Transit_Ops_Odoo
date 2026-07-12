from decimal import Decimal
from datetime import datetime
from pydantic import BaseModel


class MaintenanceCreate(BaseModel):
    vehicle_id: str
    category: str
    description: str | None = None
    cost: Decimal = Decimal(0)


class MaintenanceClose(BaseModel):
    cost: Decimal


class MaintenanceRead(BaseModel):
    id: str
    vehicle_id: str
    category: str
    description: str | None
    cost: Decimal
    status: str
    opened_at: datetime
    closed_at: datetime | None

    class Config:
        from_attributes = True
