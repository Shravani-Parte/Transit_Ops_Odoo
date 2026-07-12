<<<<<<< HEAD
"""SQLAlchemy ORM: User. Scaffold — column set mirrors DATA_MODEL.md."""
from __future__ import annotations
from datetime import datetime, date
from decimal import Decimal
from sqlalchemy import String, ForeignKey, DateTime, Date, Numeric, Enum, Text, JSON
from sqlalchemy.orm import Mapped, mapped_column, relationship
=======
from sqlalchemy import Column, Integer, String, Boolean, TIMESTAMP, ForeignKey
from sqlalchemy.orm import relationship
from sqlalchemy.sql import func

>>>>>>> e21946685e62ae18c3f3933d86dd20bdbac55cd8
from app.db.base import Base


class User(Base):
    __tablename__ = "users"

<<<<<<< HEAD
    id: Mapped[str] = mapped_column(String(36), primary_key=True)
    name: Mapped[str] = mapped_column(String(128), nullable=False)
    email: Mapped[str] = mapped_column(String(191), unique=True, nullable=False)
    password_hash: Mapped[str] = mapped_column(String(255), nullable=False)
    role_id: Mapped[str] = mapped_column(String(36), ForeignKey("roles.id"))
    status: Mapped[str] = mapped_column(String(16), default="Active")
    created_at: Mapped[datetime] = mapped_column(DateTime, default=datetime.utcnow)
    updated_at: Mapped[datetime] = mapped_column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)

=======
    user_id = Column(Integer, primary_key=True, autoincrement=True)
    full_name = Column(String(100), nullable=False)
    email = Column(String(150), unique=True, nullable=False)
    password_hash = Column(String(255), nullable=False)
    role_id = Column(Integer, ForeignKey("roles.role_id"), nullable=False)
    is_active = Column(Boolean, default=True)
    last_login_at = Column(TIMESTAMP, nullable=True)
    created_at = Column(TIMESTAMP, server_default=func.now())
    updated_at = Column(TIMESTAMP, server_default=func.now(), onupdate=func.now())

    role = relationship("Role", back_populates="users")
>>>>>>> e21946685e62ae18c3f3933d86dd20bdbac55cd8
