<<<<<<< HEAD
"""SQLAlchemy ORM: Region. Scaffold — column set mirrors DATA_MODEL.md."""
from __future__ import annotations
from datetime import datetime, date
from decimal import Decimal
from sqlalchemy import String, ForeignKey, DateTime, Date, Numeric, Enum, Text, JSON
from sqlalchemy.orm import Mapped, mapped_column, relationship
=======
from sqlalchemy import Column, Integer, String

>>>>>>> e21946685e62ae18c3f3933d86dd20bdbac55cd8
from app.db.base import Base


class Region(Base):
    __tablename__ = "regions"

<<<<<<< HEAD
    id: Mapped[str] = mapped_column(String(36), primary_key=True)
    name: Mapped[str] = mapped_column(String(64), unique=True, nullable=False)

=======
    region_id = Column(Integer, primary_key=True, autoincrement=True)
    region_name = Column(String(100), unique=True, nullable=False)
>>>>>>> e21946685e62ae18c3f3933d86dd20bdbac55cd8
