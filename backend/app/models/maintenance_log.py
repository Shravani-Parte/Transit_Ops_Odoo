from sqlalchemy import Column, Integer, String, Text, DECIMAL, Enum, TIMESTAMP, ForeignKey
from sqlalchemy.orm import relationship
from sqlalchemy.sql import func

from app.db.base import Base


class MaintenanceLog(Base):
    __tablename__ = "maintenance_logs"

    maintenance_id = Column(Integer, primary_key=True, autoincrement=True)
    vehicle_id = Column(Integer, ForeignKey("vehicles.vehicle_id"), nullable=False)
    maintenance_type = Column(String(100), nullable=False)
    description = Column(Text)
    cost = Column(DECIMAL(14, 2), default=0)
    status = Column(Enum("Open", "Closed"), nullable=False, default="Open")
    opened_at = Column(TIMESTAMP, server_default=func.now())
    closed_at = Column(TIMESTAMP)
    created_by = Column(Integer, ForeignKey("users.user_id"), nullable=False)
    updated_at = Column(TIMESTAMP, server_default=func.now(), onupdate=func.now())

    vehicle = relationship("Vehicle")
