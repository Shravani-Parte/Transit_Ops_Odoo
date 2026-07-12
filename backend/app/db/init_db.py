from datetime import date

from sqlalchemy.orm import Session

from app.core.security import get_password_hash
from app.db.base import Base
from app.db.session import engine
from app.models.driver import Driver
from app.models.maintenance_log import MaintenanceLog
from app.models.permission import Permission
from app.models.region import Region
from app.models.role import Role
from app.models.role_permission import RolePermission
from app.models.trip import Trip
from app.models.user import User
from app.models.vehicle import Vehicle
from app.models.org_settings import OrgSettings
from app.models.fuel_log import FuelLog
from app.models.expense import Expense


PERMISSIONS = [
    ("vehicle", "create"), ("vehicle", "read"), ("vehicle", "update"), ("vehicle", "delete"),
    ("driver", "create"), ("driver", "read"), ("driver", "update"), ("driver", "delete"),
    ("trip", "create"), ("trip", "read"), ("trip", "update"), ("trip", "delete"),
    ("maintenance", "create"), ("maintenance", "read"), ("maintenance", "update"), ("maintenance", "delete"),
    ("fuel_expense", "create"), ("fuel_expense", "read"), ("fuel_expense", "update"), ("fuel_expense", "delete"),
    ("reports", "read"), ("reports", "export"),
    ("dashboard", "read"),
    ("settings", "read"), ("settings", "update"),
    ("notifications", "read"),
]

ROLE_PERMS = {
    "Fleet Manager": "all",
    "Dispatcher": [
        ("vehicle", "read"), ("driver", "read"),
        ("trip", "create"), ("trip", "read"), ("trip", "update"), ("trip", "delete"),
        ("dashboard", "read"), ("fuel_expense", "create"), ("notifications", "read"),
    ],
    "Safety Officer": [
        ("driver", "create"), ("driver", "read"), ("driver", "update"), ("driver", "delete"),
        ("trip", "read"), ("dashboard", "read"), ("notifications", "read"),
    ],
    "Financial Analyst": [
        ("vehicle", "read"), ("maintenance", "read"), ("trip", "read"),
        ("fuel_expense", "create"), ("fuel_expense", "read"), ("fuel_expense", "update"), ("fuel_expense", "delete"),
        ("reports", "read"), ("reports", "export"), ("dashboard", "read"), ("notifications", "read"),
    ],
}


def init_db(db: Session) -> None:
    if db.query(Role).count() > 0:
        return

    roles = {}
    for name, desc in [
        ("Fleet Manager", "Oversees fleet assets and operational efficiency"),
        ("Dispatcher", "Creates trips and assigns vehicles/drivers"),
        ("Safety Officer", "Ensures driver compliance and safety"),
        ("Financial Analyst", "Reviews expenses and profitability"),
    ]:
        r = Role(role_name=name, description=desc)
        db.add(r)
        db.flush()
        roles[name] = r

    perm_map = {}
    for module, action in PERMISSIONS:
        p = Permission(module=module, action=action)
        db.add(p)
        db.flush()
        perm_map[(module, action)] = p

    for role_name, perms in ROLE_PERMS.items():
        role = roles[role_name]
        if perms == "all":
            perms = list(perm_map.keys())
        for key in perms:
            db.add(RolePermission(role_id=role.role_id, permission_id=perm_map[key].permission_id))

    regions = {}
    for name in ["North Zone", "South Zone", "East Zone", "West Zone", "Central Zone"]:
        r = Region(region_name=name)
        db.add(r)
        db.flush()
        regions[name] = r

    db.add(OrgSettings(depot_name="TransitOps Central Depot", currency="INR", distance_unit="km"))

    pwd = get_password_hash("password123")
    users = [
        ("Rajesh Kumar", "fleet@transitops.com", "Fleet Manager"),
        ("Priya Sharma", "dispatcher@transitops.com", "Dispatcher"),
        ("Amit Patel", "safety@transitops.com", "Safety Officer"),
        ("Sneha Reddy", "finance@transitops.com", "Financial Analyst"),
    ]
    for full_name, email, role_name in users:
        db.add(User(full_name=full_name, email=email, password_hash=pwd, role_id=roles[role_name].role_id))

    db.flush()

    vehicles_data = [
        ("MH-12-AB-1234", "Van-05", "Van", 500, 45230, 850000, "North Zone"),
        ("MH-12-CD-5678", "Truck-12", "Truck", 2000, 128500, 2500000, "South Zone"),
        ("MH-12-EF-9012", "Van-08", "Van", 750, 32100, 920000, "East Zone"),
        ("MH-12-GH-3456", "Trailer-03", "Trailer", 5000, 89000, 1800000, "West Zone"),
        ("MH-12-IJ-7890", "Van-02", "Van", 400, 67800, 720000, "Central Zone"),
    ]
    for reg, name, vtype, cap, odo, cost, region_name in vehicles_data:
        status = "In Shop" if name == "Trailer-03" else "Available"
        db.add(Vehicle(registration_number=reg, vehicle_name=name, vehicle_type=vtype, max_load_capacity=cap, odometer=odo, acquisition_cost=cost, region_id=regions[region_name].region_id, status=status))

    db.flush()

    drivers_data = [
        ("Alex Johnson", "DL-MH-2019-001234", "LMV", date(2027, 6, 15), "+91-9876543210", 95.5, "Available"),
        ("Maria Garcia", "DL-MH-2020-005678", "HMV", date(2026, 12, 20), "+91-9876543211", 88.0, "Available"),
        ("John Smith", "DL-MH-2018-009012", "LMV", date(2025, 3, 10), "+91-9876543212", 72.5, "Available"),
        ("Sarah Wilson", "DL-MH-2021-003456", "HMV", date(2028, 8, 25), "+91-9876543213", 91.0, "Off Duty"),
        ("David Brown", "DL-MH-2017-007890", "LMV", date(2024, 1, 5), "+91-9876543214", 45.0, "Suspended"),
    ]
    for name, lic, cat, exp, contact, score, status in drivers_data:
        db.add(Driver(full_name=name, license_number=lic, license_category=cat, license_expiry_date=exp, contact_number=contact, safety_score=score, status=status))

    db.flush()
    db.add(MaintenanceLog(vehicle_id=4, maintenance_type="Brake System Repair", description="Full brake pad replacement", cost=15000, status="Open", created_by=1))
    db.add(Trip(trip_code="TRIP-000001", source="Mumbai Warehouse", destination="Pune Distribution Center", vehicle_id=1, driver_id=1, cargo_weight=450, planned_distance=150, revenue=25000, status="Draft", created_by=2))
    completed = Trip(trip_code="TRIP-000002", source="Delhi Hub", destination="Jaipur Depot", vehicle_id=2, driver_id=2, cargo_weight=1800, planned_distance=280, actual_distance=275, revenue=85000, status="Completed", created_by=2, fuel_consumed=85, starting_odometer=128000, final_odometer=128275)
    db.add(completed)
    db.flush()
    db.add(FuelLog(vehicle_id=2, trip_id=completed.trip_id, liters=85, cost=7650, log_date=date(2026, 3, 1), recorded_by=4))
    db.add(Expense(vehicle_id=2, trip_id=completed.trip_id, expense_type="Toll", amount=1200, expense_date=date(2026, 3, 1), description="Highway toll", recorded_by=4))
    db.commit()


def create_tables():
    import app.models  # noqa: F401
    Base.metadata.create_all(bind=engine)
