# Import all models for SQLAlchemy metadata
from app.models.role import Role
from app.models.permission import Permission
from app.models.role_permission import RolePermission
from app.models.user import User
from app.models.region import Region
from app.models.vehicle import Vehicle
from app.models.vehicle_status_history import VehicleStatusHistory
from app.models.driver import Driver
from app.models.driver_status_history import DriverStatusHistory
from app.models.trip import Trip
from app.models.trip_status_history import TripStatusHistory
from app.models.maintenance_log import MaintenanceLog
from app.models.fuel_log import FuelLog
from app.models.expense import Expense
from app.models.notification import Notification
from app.models.org_settings import OrgSettings
