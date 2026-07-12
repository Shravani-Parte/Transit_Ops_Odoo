from datetime import date, datetime
from decimal import Decimal
<<<<<<< HEAD
=======
from typing import Optional
>>>>>>> e21946685e62ae18c3f3933d86dd20bdbac55cd8
from pydantic import BaseModel


class DriverBase(BaseModel):
<<<<<<< HEAD
    name: str
    license_number: str
    license_category: str
    license_expiry_date: date
    contact_number: str | None = None
=======
    full_name: str
    license_number: str
    license_category: str
    license_expiry_date: date
    contact_number: str
    safety_score: Decimal = Decimal("100")
    status: str = "Available"
>>>>>>> e21946685e62ae18c3f3933d86dd20bdbac55cd8


class DriverCreate(DriverBase):
    pass


class DriverUpdate(BaseModel):
<<<<<<< HEAD
    name: str | None = None
    license_category: str | None = None
    license_expiry_date: date | None = None
    contact_number: str | None = None
    safety_score: Decimal | None = None
    status: str | None = None


class DriverRead(DriverBase):
    id: str
    safety_score: Decimal
    status: str
    created_at: datetime
=======
    full_name: Optional[str] = None
    license_number: Optional[str] = None
    license_category: Optional[str] = None
    license_expiry_date: Optional[date] = None
    contact_number: Optional[str] = None
    safety_score: Optional[Decimal] = None
    status: Optional[str] = None


class DriverOut(DriverBase):
    driver_id: int
    license_valid: bool = True
    created_at: Optional[datetime] = None

    class Config:
        from_attributes = True


class DriverStatusHistoryOut(BaseModel):
    history_id: int
    old_status: Optional[str]
    new_status: str
    reason: Optional[str]
    changed_at: Optional[datetime]
>>>>>>> e21946685e62ae18c3f3933d86dd20bdbac55cd8

    class Config:
        from_attributes = True
