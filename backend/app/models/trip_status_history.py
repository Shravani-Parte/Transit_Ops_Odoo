<<<<<<< HEAD
"""SQLAlchemy ORM: TripStatusHistory. Scaffold — column set mirrors DATA_MODEL.md."""
from __future__ import annotations
from datetime import datetime, date
from decimal import Decimal
from sqlalchemy import String, ForeignKey, DateTime, Date, Numeric, Enum, Text, JSON
from sqlalchemy.orm import Mapped, mapped_column, relationship
=======
from sqlalchemy import Column, BigInteger, Integer, Enum, TIMESTAMP, ForeignKey
from sqlalchemy.orm import relationship
from sqlalchemy.sql import func

>>>>>>> e21946685e62ae18c3f3933d86dd20bdbac55cd8
from app.db.base import Base


class TripStatusHistory(Base):
    __tablename__ = "trip_status_history"

<<<<<<< HEAD
    id: Mapped[str] = mapped_column(String(36), primary_key=True)
    trip_id: Mapped[str] = mapped_column(String(36), ForeignKey("trips.id"), nullable=False)
    from_status: Mapped[str | None] = mapped_column(String(32))
    to_status: Mapped[str] = mapped_column(String(32), nullable=False)
    reason: Mapped[str | None] = mapped_column(String(255))
    changed_by: Mapped[str | None] = mapped_column(String(36))
    changed_at: Mapped[datetime] = mapped_column(DateTime, default=datetime.utcnow)

=======
    history_id = Column(BigInteger, primary_key=True, autoincrement=True)
    trip_id = Column(Integer, ForeignKey("trips.trip_id", ondelete="CASCADE"), nullable=False)
    old_status = Column(Enum("Draft", "Dispatched", "Completed", "Cancelled"))
    new_status = Column(Enum("Draft", "Dispatched", "Completed", "Cancelled"), nullable=False)
    changed_by = Column(Integer, ForeignKey("users.user_id"))
    changed_at = Column(TIMESTAMP, server_default=func.now())

    trip = relationship("Trip", back_populates="status_history")
>>>>>>> e21946685e62ae18c3f3933d86dd20bdbac55cd8
