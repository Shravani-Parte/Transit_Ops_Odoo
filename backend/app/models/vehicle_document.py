<<<<<<< HEAD
"""SQLAlchemy ORM: VehicleDocument. Scaffold — column set mirrors DATA_MODEL.md."""
from __future__ import annotations
from datetime import datetime, date
from decimal import Decimal
from sqlalchemy import String, ForeignKey, DateTime, Date, Numeric, Enum, Text, JSON
from sqlalchemy.orm import Mapped, mapped_column, relationship
=======
from sqlalchemy import Column, Integer, String, Date, TIMESTAMP, ForeignKey
from sqlalchemy.sql import func

>>>>>>> e21946685e62ae18c3f3933d86dd20bdbac55cd8
from app.db.base import Base


class VehicleDocument(Base):
    __tablename__ = "vehicle_documents"

<<<<<<< HEAD
    id: Mapped[str] = mapped_column(String(36), primary_key=True)
    vehicle_id: Mapped[str] = mapped_column(String(36), ForeignKey("vehicles.id"), nullable=False)
    doc_type: Mapped[str] = mapped_column(String(64), nullable=False)
    file_url: Mapped[str | None] = mapped_column(String(512))
    expires_on: Mapped[date | None] = mapped_column(Date)
    uploaded_at: Mapped[datetime] = mapped_column(DateTime, default=datetime.utcnow)

=======
    document_id = Column(Integer, primary_key=True, autoincrement=True)
    vehicle_id = Column(Integer, ForeignKey("vehicles.vehicle_id"), nullable=False)
    document_type = Column(String(50), nullable=False)
    file_url = Column(String(500), nullable=False)
    expiry_date = Column(Date)
    uploaded_by = Column(Integer, ForeignKey("users.user_id"))
    uploaded_at = Column(TIMESTAMP, server_default=func.now())
>>>>>>> e21946685e62ae18c3f3933d86dd20bdbac55cd8
