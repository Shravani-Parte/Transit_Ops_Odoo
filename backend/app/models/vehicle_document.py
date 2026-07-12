from sqlalchemy import Column, Integer, String, Date, TIMESTAMP, ForeignKey
from sqlalchemy.sql import func

from app.db.base import Base


class VehicleDocument(Base):
    __tablename__ = "vehicle_documents"

    document_id = Column(Integer, primary_key=True, autoincrement=True)
    vehicle_id = Column(Integer, ForeignKey("vehicles.vehicle_id"), nullable=False)
    document_type = Column(String(50), nullable=False)
    file_url = Column(String(500), nullable=False)
    expiry_date = Column(Date)
    uploaded_by = Column(Integer, ForeignKey("users.user_id"))
    uploaded_at = Column(TIMESTAMP, server_default=func.now())
