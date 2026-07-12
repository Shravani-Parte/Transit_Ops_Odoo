<<<<<<< HEAD
"""SQLAlchemy ORM: Role. Scaffold — column set mirrors DATA_MODEL.md."""
from __future__ import annotations
from datetime import datetime, date
from decimal import Decimal
from sqlalchemy import String, ForeignKey, DateTime, Date, Numeric, Enum, Text, JSON
from sqlalchemy.orm import Mapped, mapped_column, relationship
=======
from sqlalchemy import Column, Integer, String, Text, TIMESTAMP, ForeignKey
from sqlalchemy.orm import relationship
from sqlalchemy.sql import func

>>>>>>> e21946685e62ae18c3f3933d86dd20bdbac55cd8
from app.db.base import Base


class Role(Base):
    __tablename__ = "roles"

<<<<<<< HEAD
    id: Mapped[str] = mapped_column(String(36), primary_key=True)
    name: Mapped[str] = mapped_column(String(64), unique=True, nullable=False)
    description: Mapped[str | None] = mapped_column(String(255))
    # Enum values (kept in sync with frontend/src/config/constants.js):
    #   FleetManager | Dispatcher | SafetyOfficer | FinancialAnalyst

=======
    role_id = Column(Integer, primary_key=True, autoincrement=True)
    role_name = Column(String(50), unique=True, nullable=False)
    description = Column(String(255))
    created_at = Column(TIMESTAMP, server_default=func.now())

    users = relationship("User", back_populates="role")
    role_permissions = relationship("RolePermission", back_populates="role")
>>>>>>> e21946685e62ae18c3f3933d86dd20bdbac55cd8
