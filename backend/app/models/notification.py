<<<<<<< HEAD
"""SQLAlchemy ORM: Notification. Scaffold — column set mirrors DATA_MODEL.md."""
from __future__ import annotations
from datetime import datetime, date
from decimal import Decimal
from sqlalchemy import String, ForeignKey, DateTime, Date, Numeric, Enum, Text, JSON
from sqlalchemy.orm import Mapped, mapped_column, relationship
=======
from sqlalchemy import Column, Integer, String, Boolean, TIMESTAMP, ForeignKey
from sqlalchemy.sql import func

>>>>>>> e21946685e62ae18c3f3933d86dd20bdbac55cd8
from app.db.base import Base


class Notification(Base):
    __tablename__ = "notifications"

<<<<<<< HEAD
    id: Mapped[str] = mapped_column(String(36), primary_key=True)
    user_id: Mapped[str | None] = mapped_column(String(36), ForeignKey("users.id"))
    kind: Mapped[str] = mapped_column(String(64), nullable=False)
    payload: Mapped[dict | None] = mapped_column(JSON)
    read_at: Mapped[datetime | None] = mapped_column(DateTime)
    created_at: Mapped[datetime] = mapped_column(DateTime, default=datetime.utcnow)

=======
    notification_id = Column(Integer, primary_key=True, autoincrement=True)
    recipient_user_id = Column(Integer, ForeignKey("users.user_id"), nullable=False)
    type = Column(String(50), nullable=False)
    reference_table = Column(String(50))
    reference_id = Column(Integer)
    message = Column(String(255), nullable=False)
    is_read = Column(Boolean, default=False)
    created_at = Column(TIMESTAMP, server_default=func.now())
>>>>>>> e21946685e62ae18c3f3933d86dd20bdbac55cd8
