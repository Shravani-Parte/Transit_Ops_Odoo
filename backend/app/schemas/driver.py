from datetime import date, datetime
from decimal import Decimal
from typing import Optional
from pydantic import BaseModel


class DriverBase(BaseModel):
    full_name: str
    license_number: str
    license_category: str
    license_expiry_date: date
    contact_number: str
    safety_score: Decimal = Decimal("100")
    status: str = "Available"


class DriverCreate(DriverBase):
    pass


class DriverUpdate(BaseModel):
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

    class Config:
        from_attributes = True
