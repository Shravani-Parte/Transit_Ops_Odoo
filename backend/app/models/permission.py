<<<<<<< HEAD
"""SQLAlchemy ORM: Permission. Scaffold — column set mirrors DATA_MODEL.md."""
from __future__ import annotations
from datetime import datetime, date
from decimal import Decimal
from sqlalchemy import String, ForeignKey, DateTime, Date, Numeric, Enum, Text, JSON
from sqlalchemy.orm import Mapped, mapped_column, relationship
=======
from sqlalchemy import Column, Integer, String, UniqueConstraint

>>>>>>> e21946685e62ae18c3f3933d86dd20bdbac55cd8
from app.db.base import Base


class Permission(Base):
    __tablename__ = "permissions"
<<<<<<< HEAD

    id: Mapped[str] = mapped_column(String(36), primary_key=True)
    module: Mapped[str] = mapped_column(String(64), nullable=False)
    action: Mapped[str] = mapped_column(String(64), nullable=False)
    description: Mapped[str | None] = mapped_column(String(255))

=======
    __table_args__ = (UniqueConstraint("module", "action", name="uq_module_action"),)

    permission_id = Column(Integer, primary_key=True, autoincrement=True)
    module = Column(String(50), nullable=False)
    action = Column(String(20), nullable=False)
>>>>>>> e21946685e62ae18c3f3933d86dd20bdbac55cd8
