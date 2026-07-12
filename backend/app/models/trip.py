from sqlalchemy import Column, Integer, String, DECIMAL, Enum, TIMESTAMP, ForeignKey
from sqlalchemy.orm import relationship
from sqlalchemy.sql import func

from app.db.base import Base


class Trip(Base):
    __tablename__ = "trips"

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
