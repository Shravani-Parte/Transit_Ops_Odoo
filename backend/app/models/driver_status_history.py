from sqlalchemy import Column, BigInteger, Integer, String, Enum, TIMESTAMP, ForeignKey
from sqlalchemy.orm import relationship
from sqlalchemy.sql import func

from app.db.base import Base


class DriverStatusHistory(Base):
    __tablename__ = "driver_status_history"

    history_id = Column(BigInteger, primary_key=True, autoincrement=True)
    driver_id = Column(Integer, ForeignKey("drivers.driver_id", ondelete="CASCADE"), nullable=False)
    old_status = Column(Enum("Available", "On Trip", "Off Duty", "Suspended"))
    new_status = Column(Enum("Available", "On Trip", "Off Duty", "Suspended"), nullable=False)
    changed_by = Column(Integer, ForeignKey("users.user_id"))
    reason = Column(String(255))
    changed_at = Column(TIMESTAMP, server_default=func.now())

    driver = relationship("Driver", back_populates="status_history")
