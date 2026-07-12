"""Declarative Base + imports all models so Alembic can autogenerate."""
from sqlalchemy.orm import DeclarativeBase


class Base(DeclarativeBase):
    pass


# Import models so metadata is populated — commented out to avoid circular import
# from app.models.role import Role  # noqa
# from app.models.permission import Permission  # noqa
# from app.models.role_permission import RolePermission  # noqa
# from app.models.user import User  # noqa
# from app.models.region import Region  # noqa
# from app.models.vehicle import Vehicle  # noqa
# from app.models.vehicle_status_history import VehicleStatusHistory  # noqa
# from app.models.vehicle_document import VehicleDocument  # noqa
# from app.models.driver import Driver  # noqa
# from app.models.driver_status_history import DriverStatusHistory  # noqa
# from app.models.trip import Trip  # noqa
# from app.models.trip_status_history import TripStatusHistory  # noqa
# from app.models.maintenance_log import MaintenanceLog  # noqa
# from app.models.fuel_log import FuelLog  # noqa
# from app.models.expense import Expense  # noqa
# from app.models.notification import Notification  # noqa
