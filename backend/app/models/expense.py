from sqlalchemy import Column, Integer, String, DECIMAL, Date, Enum, TIMESTAMP, ForeignKey
from sqlalchemy.orm import relationship
from sqlalchemy.sql import func

from app.db.base import Base


class Expense(Base):
    __tablename__ = "expenses"

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
