from sqlalchemy import Column, Integer, String, TIMESTAMP
from sqlalchemy.sql import func

from app.db.base import Base


class OrgSettings(Base):
    __tablename__ = "org_settings"

    setting_id = Column(Integer, primary_key=True, autoincrement=True)
    depot_name = Column(String(100), default="TransitOps Depot")
    currency = Column(String(10), default="INR")
    distance_unit = Column(String(10), default="km")
    updated_at = Column(TIMESTAMP, server_default=func.now(), onupdate=func.now())
