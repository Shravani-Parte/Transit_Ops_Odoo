<<<<<<< HEAD
"""SQLAlchemy ORM: Driver. Scaffold — column set mirrors DATA_MODEL.md."""
from __future__ import annotations
from datetime import datetime, date
from decimal import Decimal
from sqlalchemy import String, ForeignKey, DateTime, Date, Numeric, Enum, Text, JSON
from sqlalchemy.orm import Mapped, mapped_column, relationship
=======
from sqlalchemy import Column, Integer, String, Date, DECIMAL, Enum, Boolean, TIMESTAMP, ForeignKey
from sqlalchemy.orm import relationship
from sqlalchemy.sql import func

>>>>>>> e21946685e62ae18c3f3933d86dd20bdbac55cd8
from app.db.base import Base


class Driver(Base):
    __tablename__ = "drivers"

<<<<<<< HEAD
    id: Mapped[str] = mapped_column(String(36), primary_key=True)
    name: Mapped[str] = mapped_column(String(128), nullable=False)
    license_number: Mapped[str] = mapped_column(String(64), unique=True, nullable=False)
    license_category: Mapped[str] = mapped_column(String(32), nullable=False)
    license_expiry_date: Mapped[date] = mapped_column(Date, nullable=False)
    contact_number: Mapped[str | None] = mapped_column(String(32))
    safety_score: Mapped[Decimal] = mapped_column(Numeric(5, 2), default=100)
    status: Mapped[str] = mapped_column(String(16), index=True, default="Available")
    user_id: Mapped[str | None] = mapped_column(String(36), ForeignKey("users.id"))
    created_at: Mapped[datetime] = mapped_column(DateTime, default=datetime.utcnow)
    updated_at: Mapped[datetime] = mapped_column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)

=======
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
>>>>>>> e21946685e62ae18c3f3933d86dd20bdbac55cd8
