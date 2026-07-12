"""SQLAlchemy ORM: FuelLog. Scaffold — column set mirrors DATA_MODEL.md."""
from __future__ import annotations
from datetime import datetime, date
from decimal import Decimal
from sqlalchemy import String, ForeignKey, DateTime, Date, Numeric, Enum, Text, JSON
from sqlalchemy.orm import Mapped, mapped_column, relationship
from app.db.base import Base


class FuelLog(Base):
    __tablename__ = "fuel_logs"

    id: Mapped[str] = mapped_column(String(36), primary_key=True)
    vehicle_id: Mapped[str] = mapped_column(String(36), ForeignKey("vehicles.id"), nullable=False)
    trip_id: Mapped[str | None] = mapped_column(String(36), ForeignKey("trips.id"))
    liters: Mapped[Decimal] = mapped_column(Numeric(8, 2), nullable=False)
    cost: Mapped[Decimal] = mapped_column(Numeric(12, 2), nullable=False)
    odometer: Mapped[Decimal | None] = mapped_column(Numeric(12, 2))
    logged_at: Mapped[datetime] = mapped_column(DateTime, default=datetime.utcnow)

