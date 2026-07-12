from datetime import date, datetime
from decimal import Decimal
from pydantic import BaseModel


class DriverBase(BaseModel):
    name: str
    license_number: str
    license_category: str
    license_expiry_date: date
    contact_number: str | None = None


class DriverCreate(DriverBase):
    pass


class DriverUpdate(BaseModel):
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

    class Config:
        from_attributes = True
