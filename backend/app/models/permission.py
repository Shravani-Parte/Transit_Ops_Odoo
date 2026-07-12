from sqlalchemy import Column, Integer, String, UniqueConstraint

from app.db.base import Base


class Permission(Base):
    __tablename__ = "permissions"
    __table_args__ = (UniqueConstraint("module", "action", name="uq_module_action"),)

    permission_id = Column(Integer, primary_key=True, autoincrement=True)
    module = Column(String(50), nullable=False)
    action = Column(String(20), nullable=False)
