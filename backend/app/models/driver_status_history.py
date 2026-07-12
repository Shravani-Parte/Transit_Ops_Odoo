<<<<<<< HEAD
"""SQLAlchemy ORM: DriverStatusHistory. Scaffold — column set mirrors DATA_MODEL.md."""
from __future__ import annotations
from datetime import datetime, date
from decimal import Decimal
from sqlalchemy import String, ForeignKey, DateTime, Date, Numeric, Enum, Text, JSON
from sqlalchemy.orm import Mapped, mapped_column, relationship
=======
from sqlalchemy import Column, BigInteger, Integer, String, Enum, TIMESTAMP, ForeignKey
from sqlalchemy.orm import relationship
from sqlalchemy.sql import func

>>>>>>> e21946685e62ae18c3f3933d86dd20bdbac55cd8
from app.db.base import Base


class DriverStatusHistory(Base):
    __tablename__ = "driver_status_history"

<<<<<<< HEAD
    id: Mapped[str] = mapped_column(String(36), primary_key=True)
    driver_id: Mapped[str] = mapped_column(String(36), ForeignKey("drivers.id"), nullable=False)
    from_status: Mapped[str | None] = mapped_column(String(32))
    to_status: Mapped[str] = mapped_column(String(32), nullable=False)
    reason: Mapped[str | None] = mapped_column(String(255))
    changed_by: Mapped[str | None] = mapped_column(String(36))
    changed_at: Mapped[datetime] = mapped_column(DateTime, default=datetime.utcnow)

=======
    history_id = Column(BigInteger, primary_key=True, autoincrement=True)
    driver_id = Column(Integer, ForeignKey("drivers.driver_id", ondelete="CASCADE"), nullable=False)
    old_status = Column(Enum("Available", "On Trip", "Off Duty", "Suspended"))
    new_status = Column(Enum("Available", "On Trip", "Off Duty", "Suspended"), nullable=False)
    changed_by = Column(Integer, ForeignKey("users.user_id"))
    reason = Column(String(255))
    changed_at = Column(TIMESTAMP, server_default=func.now())

    driver = relationship("Driver", back_populates="status_history")
>>>>>>> e21946685e62ae18c3f3933d86dd20bdbac55cd8
