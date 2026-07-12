<<<<<<< HEAD
"""SQLAlchemy ORM: Expense. Scaffold — column set mirrors DATA_MODEL.md."""
from __future__ import annotations
from datetime import datetime, date
from decimal import Decimal
from sqlalchemy import String, ForeignKey, DateTime, Date, Numeric, Enum, Text, JSON
from sqlalchemy.orm import Mapped, mapped_column, relationship
=======
from sqlalchemy import Column, Integer, String, DECIMAL, Date, Enum, TIMESTAMP, ForeignKey
from sqlalchemy.orm import relationship
from sqlalchemy.sql import func

>>>>>>> e21946685e62ae18c3f3933d86dd20bdbac55cd8
from app.db.base import Base


class Expense(Base):
    __tablename__ = "expenses"

<<<<<<< HEAD
    id: Mapped[str] = mapped_column(String(36), primary_key=True)
    vehicle_id: Mapped[str | None] = mapped_column(String(36), ForeignKey("vehicles.id"))
    trip_id: Mapped[str | None] = mapped_column(String(36), ForeignKey("trips.id"))
    category: Mapped[str] = mapped_column(String(64), nullable=False)
    amount: Mapped[Decimal] = mapped_column(Numeric(12, 2), nullable=False)
    notes: Mapped[str | None] = mapped_column(String(500))
    incurred_at: Mapped[datetime] = mapped_column(DateTime, default=datetime.utcnow)

=======
    expense_id = Column(Integer, primary_key=True, autoincrement=True)
    vehicle_id = Column(Integer, ForeignKey("vehicles.vehicle_id"), nullable=False)
    trip_id = Column(Integer, ForeignKey("trips.trip_id"))
    expense_type = Column(Enum("Toll", "Maintenance", "Other"), nullable=False)
    amount = Column(DECIMAL(14, 2), nullable=False)
    expense_date = Column(Date, nullable=False)
    description = Column(String(255))
    recorded_by = Column(Integer, ForeignKey("users.user_id"), nullable=False)
    created_at = Column(TIMESTAMP, server_default=func.now())

    vehicle = relationship("Vehicle")
    trip = relationship("Trip")
>>>>>>> e21946685e62ae18c3f3933d86dd20bdbac55cd8
