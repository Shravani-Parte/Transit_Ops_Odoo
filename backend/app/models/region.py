from sqlalchemy import Column, Integer, String

from app.db.base import Base


class Region(Base):
    __tablename__ = "regions"

    region_id = Column(Integer, primary_key=True, autoincrement=True)
    region_name = Column(String(100), unique=True, nullable=False)
