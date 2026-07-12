from sqlalchemy import Column, Integer, String, Boolean, DECIMAL, Enum, TIMESTAMP, ForeignKey
from sqlalchemy.orm import relationship
from sqlalchemy.sql import func

from app.db.base import Base


class Vehicle(Base):
    __tablename__ = "vehicles"

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
