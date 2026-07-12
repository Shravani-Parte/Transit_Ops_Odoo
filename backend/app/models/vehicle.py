<<<<<<< HEAD
"""SQLAlchemy ORM: Vehicle. Scaffold — column set mirrors DATA_MODEL.md."""
from __future__ import annotations
from datetime import datetime, date
from decimal import Decimal
from sqlalchemy import String, ForeignKey, DateTime, Date, Numeric, Enum, Text, JSON
from sqlalchemy.orm import Mapped, mapped_column, relationship
=======
from sqlalchemy import Column, Integer, String, Boolean, DECIMAL, Enum, TIMESTAMP, ForeignKey
from sqlalchemy.orm import relationship
from sqlalchemy.sql import func

>>>>>>> e21946685e62ae18c3f3933d86dd20bdbac55cd8
from app.db.base import Base


class Vehicle(Base):
    __tablename__ = "vehicles"

<<<<<<< HEAD
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

=======
    vehicle_id = Column(Integer, primary_key=True, autoincrement=True)
    registration_number = Column(String(30), unique=True, nullable=False)
    vehicle_name = Column(String(100), nullable=False)
    vehicle_type = Column(String(50), nullable=False)
    max_load_capacity = Column(DECIMAL(10, 2), nullable=False)
    odometer = Column(DECIMAL(12, 2), nullable=False, default=0)
    acquisition_cost = Column(DECIMAL(14, 2), nullable=False)
    region_id = Column(Integer, ForeignKey("regions.region_id"))
    status = Column(Enum("Available", "On Trip", "In Shop", "Retired"), nullable=False, default="Available")
    is_deleted = Column(Boolean, default=False)
    created_at = Column(TIMESTAMP, server_default=func.now())
    updated_at = Column(TIMESTAMP, server_default=func.now(), onupdate=func.now())

    region = relationship("Region")
    status_history = relationship("VehicleStatusHistory", back_populates="vehicle")
>>>>>>> e21946685e62ae18c3f3933d86dd20bdbac55cd8
