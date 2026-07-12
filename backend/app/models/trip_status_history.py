from sqlalchemy import Column, BigInteger, Integer, Enum, TIMESTAMP, ForeignKey
from sqlalchemy.orm import relationship
from sqlalchemy.sql import func

from app.db.base import Base


class TripStatusHistory(Base):
    __tablename__ = "trip_status_history"

    history_id = Column(BigInteger, primary_key=True, autoincrement=True)
    trip_id = Column(Integer, ForeignKey("trips.trip_id", ondelete="CASCADE"), nullable=False)
    old_status = Column(Enum("Draft", "Dispatched", "Completed", "Cancelled"))
    new_status = Column(Enum("Draft", "Dispatched", "Completed", "Cancelled"), nullable=False)
    changed_by = Column(Integer, ForeignKey("users.user_id"))
    changed_at = Column(TIMESTAMP, server_default=func.now())

    trip = relationship("Trip", back_populates="status_history")
