<<<<<<< HEAD
"""SQLAlchemy ORM: MaintenanceLog. Scaffold — column set mirrors DATA_MODEL.md."""
from __future__ import annotations
from datetime import datetime, date
from decimal import Decimal
from sqlalchemy import String, ForeignKey, DateTime, Date, Numeric, Enum, Text, JSON
from sqlalchemy.orm import Mapped, mapped_column, relationship
=======
from sqlalchemy import Column, Integer, String, Text, DECIMAL, Enum, TIMESTAMP, ForeignKey
from sqlalchemy.orm import relationship
from sqlalchemy.sql import func

>>>>>>> e21946685e62ae18c3f3933d86dd20bdbac55cd8
from app.db.base import Base


class MaintenanceLog(Base):
    __tablename__ = "maintenance_logs"

<<<<<<< HEAD
    id: Mapped[str] = mapped_column(String(36), primary_key=True)
    vehicle_id: Mapped[str] = mapped_column(String(36), ForeignKey("vehicles.id"), nullable=False)
    opened_at: Mapped[datetime] = mapped_column(DateTime, default=datetime.utcnow)
    closed_at: Mapped[datetime | None] = mapped_column(DateTime)
    category: Mapped[str] = mapped_column(String(64), nullable=False)
    description: Mapped[str | None] = mapped_column(Text)
    cost: Mapped[Decimal] = mapped_column(Numeric(12, 2), default=0)
    status: Mapped[str] = mapped_column(String(16), default="Open")

=======
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
>>>>>>> e21946685e62ae18c3f3933d86dd20bdbac55cd8
