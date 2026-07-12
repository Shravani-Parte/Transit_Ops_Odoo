<<<<<<< HEAD
"""SQLAlchemy ORM: FuelLog. Scaffold — column set mirrors DATA_MODEL.md."""
from __future__ import annotations
from datetime import datetime, date
from decimal import Decimal
from sqlalchemy import String, ForeignKey, DateTime, Date, Numeric, Enum, Text, JSON
from sqlalchemy.orm import Mapped, mapped_column, relationship
=======
from sqlalchemy import Column, Integer, DECIMAL, Date, TIMESTAMP, ForeignKey
from sqlalchemy.orm import relationship
from sqlalchemy.sql import func

>>>>>>> e21946685e62ae18c3f3933d86dd20bdbac55cd8
from app.db.base import Base


class FuelLog(Base):
    __tablename__ = "fuel_logs"

<<<<<<< HEAD
    id: Mapped[str] = mapped_column(String(36), primary_key=True)
    vehicle_id: Mapped[str] = mapped_column(String(36), ForeignKey("vehicles.id"), nullable=False)
    trip_id: Mapped[str | None] = mapped_column(String(36), ForeignKey("trips.id"))
    liters: Mapped[Decimal] = mapped_column(Numeric(8, 2), nullable=False)
    cost: Mapped[Decimal] = mapped_column(Numeric(12, 2), nullable=False)
    odometer: Mapped[Decimal | None] = mapped_column(Numeric(12, 2))
    logged_at: Mapped[datetime] = mapped_column(DateTime, default=datetime.utcnow)

=======
    fuel_log_id = Column(Integer, primary_key=True, autoincrement=True)
    vehicle_id = Column(Integer, ForeignKey("vehicles.vehicle_id"), nullable=False)
    trip_id = Column(Integer, ForeignKey("trips.trip_id"))
    liters = Column(DECIMAL(10, 2), nullable=False)
    cost = Column(DECIMAL(14, 2), nullable=False)
    log_date = Column(Date, nullable=False)
    recorded_by = Column(Integer, ForeignKey("users.user_id"), nullable=False)
    created_at = Column(TIMESTAMP, server_default=func.now())

    vehicle = relationship("Vehicle")
    trip = relationship("Trip")
>>>>>>> e21946685e62ae18c3f3933d86dd20bdbac55cd8
