from sqlalchemy import Column, Integer, String, Date, DECIMAL, Enum, Boolean, TIMESTAMP, ForeignKey
from sqlalchemy.orm import relationship
from sqlalchemy.sql import func

from app.db.base import Base


class Driver(Base):
    __tablename__ = "drivers"

    driver_id = Column(Integer, primary_key=True, autoincrement=True)
    user_id = Column(Integer, ForeignKey("users.user_id"), unique=True)
    full_name = Column(String(100), nullable=False)
    license_number = Column(String(50), unique=True, nullable=False)
    license_category = Column(String(20), nullable=False)
    license_expiry_date = Column(Date, nullable=False)
    contact_number = Column(String(20), nullable=False)
    safety_score = Column(DECIMAL(5, 2), default=100.00)
    status = Column(Enum("Available", "On Trip", "Off Duty", "Suspended"), nullable=False, default="Available")
    is_deleted = Column(Boolean, default=False)
    created_at = Column(TIMESTAMP, server_default=func.now())
    updated_at = Column(TIMESTAMP, server_default=func.now(), onupdate=func.now())

    status_history = relationship("DriverStatusHistory", back_populates="driver")
