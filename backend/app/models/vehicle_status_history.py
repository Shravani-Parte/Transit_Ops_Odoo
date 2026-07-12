from sqlalchemy import Column, BigInteger, Integer, String, Enum, TIMESTAMP, ForeignKey
from sqlalchemy.orm import relationship
from sqlalchemy.sql import func

from app.db.base import Base


class VehicleStatusHistory(Base):
    __tablename__ = "vehicle_status_history"

    history_id = Column(BigInteger, primary_key=True, autoincrement=True)
    vehicle_id = Column(Integer, ForeignKey("vehicles.vehicle_id", ondelete="CASCADE"), nullable=False)
    old_status = Column(Enum("Available", "On Trip", "In Shop", "Retired"))
    new_status = Column(Enum("Available", "On Trip", "In Shop", "Retired"), nullable=False)
    changed_by = Column(Integer, ForeignKey("users.user_id"))
    reason = Column(String(255))
    changed_at = Column(TIMESTAMP, server_default=func.now())

    vehicle = relationship("Vehicle", back_populates="status_history")
