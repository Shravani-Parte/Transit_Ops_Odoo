<<<<<<< HEAD
"""SQLAlchemy ORM: RolePermission. Scaffold — column set mirrors DATA_MODEL.md."""
from __future__ import annotations
from datetime import datetime, date
from decimal import Decimal
from sqlalchemy import String, ForeignKey, DateTime, Date, Numeric, Enum, Text, JSON
from sqlalchemy.orm import Mapped, mapped_column, relationship
=======
from sqlalchemy import Column, Integer, ForeignKey
from sqlalchemy.orm import relationship

>>>>>>> e21946685e62ae18c3f3933d86dd20bdbac55cd8
from app.db.base import Base


class RolePermission(Base):
    __tablename__ = "role_permissions"

<<<<<<< HEAD
    role_id: Mapped[str] = mapped_column(String(36), ForeignKey("roles.id"), primary_key=True)
    permission_id: Mapped[str] = mapped_column(String(36), ForeignKey("permissions.id"), primary_key=True)

=======
    role_id = Column(Integer, ForeignKey("roles.role_id", ondelete="CASCADE"), primary_key=True)
    permission_id = Column(Integer, ForeignKey("permissions.permission_id", ondelete="CASCADE"), primary_key=True)

    role = relationship("Role", back_populates="role_permissions")
    permission = relationship("Permission")
>>>>>>> e21946685e62ae18c3f3933d86dd20bdbac55cd8
