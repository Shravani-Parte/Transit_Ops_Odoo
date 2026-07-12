from sqlalchemy import Column, Integer, DECIMAL, Date, TIMESTAMP, ForeignKey
from sqlalchemy.orm import relationship
from sqlalchemy.sql import func

from app.db.base import Base


class FuelLog(Base):
    __tablename__ = "fuel_logs"

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
