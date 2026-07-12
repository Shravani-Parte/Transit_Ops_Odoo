"""SQLAlchemy ORM: Vehicle. Scaffold — column set mirrors DATA_MODEL.md."""
from __future__ import annotations
from datetime import datetime, date
from decimal import Decimal
from sqlalchemy import String, ForeignKey, DateTime, Date, Numeric, Enum, Text, JSON
from sqlalchemy.orm import Mapped, mapped_column, relationship
from app.db.base import Base


class Vehicle(Base):
    __tablename__ = "vehicles"

    id: Mapped[str] = mapped_column(String(36), primary_key=True)
    registration_number: Mapped[str] = mapped_column(String(32), unique=True, index=True, nullable=False)
    name_model: Mapped[str] = mapped_column(String(128), nullable=False)
    type: Mapped[str] = mapped_column(String(64), nullable=False)
    max_load_capacity: Mapped[Decimal] = mapped_column(Numeric(10, 2), nullable=False)
    odometer: Mapped[Decimal] = mapped_column(Numeric(12, 2), default=0)
    acquisition_cost: Mapped[Decimal] = mapped_column(Numeric(12, 2), default=0)
    status: Mapped[str] = mapped_column(String(16), index=True, default="Available")
    region_id: Mapped[str | None] = mapped_column(String(36), ForeignKey("regions.id"))
    created_at: Mapped[datetime] = mapped_column(DateTime, default=datetime.utcnow)
    updated_at: Mapped[datetime] = mapped_column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)

