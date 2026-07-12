<<<<<<< HEAD
from decimal import Decimal
from datetime import datetime
=======
from datetime import datetime
from decimal import Decimal
from typing import Optional
>>>>>>> e21946685e62ae18c3f3933d86dd20bdbac55cd8
from pydantic import BaseModel


class MaintenanceCreate(BaseModel):
<<<<<<< HEAD
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
=======
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
>>>>>>> e21946685e62ae18c3f3933d86dd20bdbac55cd8

    class Config:
        from_attributes = True
