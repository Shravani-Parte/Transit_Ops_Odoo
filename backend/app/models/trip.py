<<<<<<< HEAD
"""SQLAlchemy ORM: Trip. Scaffold — column set mirrors DATA_MODEL.md."""
from __future__ import annotations
from datetime import datetime, date
from decimal import Decimal
from sqlalchemy import String, ForeignKey, DateTime, Date, Numeric, Enum, Text, JSON
from sqlalchemy.orm import Mapped, mapped_column, relationship
=======
from sqlalchemy import Column, Integer, String, DECIMAL, Enum, TIMESTAMP, ForeignKey
from sqlalchemy.orm import relationship
from sqlalchemy.sql import func

>>>>>>> e21946685e62ae18c3f3933d86dd20bdbac55cd8
from app.db.base import Base


class Trip(Base):
    __tablename__ = "trips"

<<<<<<< HEAD
    id: Mapped[str] = mapped_column(String(36), primary_key=True)
    source: Mapped[str] = mapped_column(String(128), nullable=False)
    destination: Mapped[str] = mapped_column(String(128), nullable=False)
    vehicle_id: Mapped[str] = mapped_column(String(36), ForeignKey("vehicles.id"), nullable=False)
    driver_id: Mapped[str] = mapped_column(String(36), ForeignKey("drivers.id"), nullable=False)
    cargo_weight: Mapped[Decimal] = mapped_column(Numeric(10, 2), nullable=False)
    planned_distance: Mapped[Decimal] = mapped_column(Numeric(10, 2), nullable=False)
    actual_distance: Mapped[Decimal | None] = mapped_column(Numeric(10, 2))
    revenue: Mapped[Decimal] = mapped_column(Numeric(12, 2), default=0)
    status: Mapped[str] = mapped_column(String(16), default="Draft")
    dispatched_at: Mapped[datetime | None] = mapped_column(DateTime)
    completed_at: Mapped[datetime | None] = mapped_column(DateTime)
    created_at: Mapped[datetime] = mapped_column(DateTime, default=datetime.utcnow)
    updated_at: Mapped[datetime] = mapped_column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)

=======
    trip_id = Column(Integer, primary_key=True, autoincrement=True)
    trip_code = Column(String(30), unique=True, nullable=False)
    source = Column(String(150), nullable=False)
    destination = Column(String(150), nullable=False)
    vehicle_id = Column(Integer, ForeignKey("vehicles.vehicle_id"), nullable=False)
    driver_id = Column(Integer, ForeignKey("drivers.driver_id"), nullable=False)
    cargo_weight = Column(DECIMAL(10, 2), nullable=False)
    planned_distance = Column(DECIMAL(10, 2), nullable=False)
    actual_distance = Column(DECIMAL(10, 2))
    starting_odometer = Column(DECIMAL(12, 2))
    final_odometer = Column(DECIMAL(12, 2))
    fuel_consumed = Column(DECIMAL(10, 2))
    revenue = Column(DECIMAL(14, 2), default=0)
    status = Column(Enum("Draft", "Dispatched", "Completed", "Cancelled"), nullable=False, default="Draft")
    dispatched_at = Column(TIMESTAMP)
    completed_at = Column(TIMESTAMP)
    cancelled_at = Column(TIMESTAMP)
    created_by = Column(Integer, ForeignKey("users.user_id"), nullable=False)
    created_at = Column(TIMESTAMP, server_default=func.now())
    updated_at = Column(TIMESTAMP, server_default=func.now(), onupdate=func.now())

    vehicle = relationship("Vehicle")
    driver = relationship("Driver")
    status_history = relationship("TripStatusHistory", back_populates="trip")
>>>>>>> e21946685e62ae18c3f3933d86dd20bdbac55cd8
