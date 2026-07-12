<<<<<<< HEAD
"""Seed roles, permissions, regions on first boot."""
from datetime import datetime, date
from decimal import Decimal
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select
from app.db.session import engine, SessionLocal
from app.models.role import Role
from app.models.permission import Permission
from app.models.role_permission import RolePermission
from app.models.region import Region
from app.models.user import User
from app.models.vehicle import Vehicle
from app.models.driver import Driver
from app.models.trip import Trip
from app.models.maintenance_log import MaintenanceLog
from app.models.fuel_log import FuelLog
from app.models.expense import Expense
from app.core.security import hash_password


async def seed_reference_data(db: AsyncSession) -> None:
    """Seed: 4 roles, permissions, regions, and sample data."""
    
    # Seed roles
    roles = [
        Role(id="r-fm", name="FleetManager", description="Fleet Manager — vehicle lifecycle, maintenance oversight"),
        Role(id="r-dp", name="Dispatcher", description="Dispatcher — trip creation and dispatch"),
        Role(id="r-so", name="SafetyOfficer", description="Safety Officer — driver compliance and safety"),
        Role(id="r-fa", name="FinancialAnalyst", description="Financial Analyst — cost, fuel, ROI reporting"),
    ]
    for role in roles:
        existing = await db.execute(select(Role).where(Role.id == role.id))
        if not existing.scalar_one_or_none():
            db.add(role)
    await db.commit()

    # Seed permissions
    permissions = [
        Permission(id="p-veh-full", module="vehicles", action="full"),
        Permission(id="p-veh-view", module="vehicles", action="view"),
        Permission(id="p-drv-full", module="drivers", action="full"),
        Permission(id="p-drv-view", module="drivers", action="view"),
        Permission(id="p-trp-full", module="trips", action="full"),
        Permission(id="p-trp-view", module="trips", action="view"),
        Permission(id="p-mnt-full", module="maintenance", action="full"),
        Permission(id="p-fe-full", module="fuel_expense", action="full"),
        Permission(id="p-fe-view", module="fuel_expense", action="view"),
        Permission(id="p-rpt-full", module="reports", action="full"),
        Permission(id="p-rpt-view", module="reports", action="view"),
        Permission(id="p-set-view", module="settings", action="view"),
    ]
    for perm in permissions:
        existing = await db.execute(select(Permission).where(Permission.id == perm.id))
        if not existing.scalar_one_or_none():
            db.add(perm)
    await db.commit()

    # Seed role_permissions
    role_perms = [
        ("r-fm", "p-veh-full"), ("r-fm", "p-drv-full"), ("r-fm", "p-mnt-full"), ("r-fm", "p-rpt-view"), ("r-fm", "p-fe-view"), ("r-fm", "p-set-view"),
        ("r-dp", "p-veh-view"), ("r-dp", "p-trp-full"), ("r-dp", "p-set-view"),
        ("r-so", "p-drv-full"), ("r-so", "p-trp-view"), ("r-so", "p-set-view"),
        ("r-fa", "p-veh-view"), ("r-fa", "p-fe-full"), ("r-fa", "p-rpt-full"), ("r-fa", "p-set-view"),
    ]
    for role_id, perm_id in role_perms:
        existing = await db.execute(select(RolePermission).where(RolePermission.role_id == role_id, RolePermission.permission_id == perm_id))
        if not existing.scalar_one_or_none():
            db.add(RolePermission(role_id=role_id, permission_id=perm_id))
    await db.commit()

    # Seed regions
    regions = [
        Region(id="rg-south", name="South"),
        Region(id="rg-north", name="North"),
        Region(id="rg-west", name="West"),
        Region(id="rg-east", name="East"),
    ]
    for region in regions:
        existing = await db.execute(select(Region).where(Region.id == region.id))
        if not existing.scalar_one_or_none():
            db.add(region)
    await db.commit()

    # Seed users
    users = [
        User(id="u1", name="Ramesh Iyer", email="ramesh@transitops.in", password_hash=hash_password("password123"), role_id="r-fm", status="Active"),
        User(id="u2", name="Anita Sharma", email="anita@transitops.in", password_hash=hash_password("password123"), role_id="r-dp", status="Active"),
        User(id="u3", name="Vikram Menon", email="vikram@transitops.in", password_hash=hash_password("password123"), role_id="r-so", status="Active"),
        User(id="u4", name="Priya Nair", email="priya@transitops.in", password_hash=hash_password("password123"), role_id="r-fa", status="Active"),
    ]
    for user in users:
        existing = await db.execute(select(User).where(User.id == user.id))
        if not existing.scalar_one_or_none():
            db.add(user)
    await db.commit()

    # Seed vehicles
    today = datetime.utcnow()
    vehicles = [
        Vehicle(id="v1", registration_number="TN01AB1234", name_model="Tata Ace Gold", type="Mini Truck", max_load_capacity=Decimal("750"), odometer=Decimal("45210"), acquisition_cost=Decimal("620000"), status="Available", region_id="rg-south", created_at=today),
        Vehicle(id="v2", registration_number="KA05CD5678", name_model="Ashok Leyland Dost", type="Van", max_load_capacity=Decimal("1250"), odometer=Decimal("88100"), acquisition_cost=Decimal("890000"), status="On Trip", region_id="rg-south", created_at=today),
        Vehicle(id="v3", registration_number="MH12EF9012", name_model="Tata 407", type="Truck", max_load_capacity=Decimal("2500"), odometer=Decimal("132500"), acquisition_cost=Decimal("1250000"), status="In Shop", region_id="rg-west", created_at=today),
        Vehicle(id="v4", registration_number="DL03GH3456", name_model="Eicher Pro 3015", type="Truck", max_load_capacity=Decimal("7500"), odometer=Decimal("210300"), acquisition_cost=Decimal("2200000"), status="Available", region_id="rg-north", created_at=today),
        Vehicle(id="v5", registration_number="GJ01IJ7890", name_model="Bharat Benz 1617", type="Tanker", max_load_capacity=Decimal("9000"), odometer=Decimal("65400"), acquisition_cost=Decimal("2850000"), status="Available", region_id="rg-west", created_at=today),
        Vehicle(id="v6", registration_number="TN22KL2345", name_model="Mahindra Bolero Pikup", type="Mini Truck", max_load_capacity=Decimal("1000"), odometer=Decimal("34120"), acquisition_cost=Decimal("780000"), status="On Trip", region_id="rg-south", created_at=today),
        Vehicle(id="v7", registration_number="KA01MN6789", name_model="Force Traveller", type="Van", max_load_capacity=Decimal("900"), odometer=Decimal("22540"), acquisition_cost=Decimal("1100000"), status="Available", region_id="rg-south", created_at=today),
        Vehicle(id="v8", registration_number="HR26OP1122", name_model="Tata Prima 3128", type="Trailer", max_load_capacity=Decimal("25000"), odometer=Decimal("145200"), acquisition_cost=Decimal("4500000"), status="Retired", region_id="rg-north", created_at=today),
    ]
    for vehicle in vehicles:
        existing = await db.execute(select(Vehicle).where(Vehicle.id == vehicle.id))
        if not existing.scalar_one_or_none():
            db.add(vehicle)
    await db.commit()

    # Seed drivers
    def add_days(n): return date.today().replace(day=date.today().day + n) if n > 0 else date.today().replace(day=date.today().day + n)
    drivers = [
        Driver(id="d1", name="Suresh Kumar", license_number="TN-2020-000123", license_category="HMV", license_expiry_date=date.fromisoformat("2026-12-01"), contact_number="+91 98765 43210", safety_score=Decimal("92"), status="Available", created_at=today),
        Driver(id="d2", name="Manoj Pillai", license_number="KA-2019-004512", license_category="LMV", license_expiry_date=date.fromisoformat("2026-08-25"), contact_number="+91 99887 12345", safety_score=Decimal("88"), status="On Trip", created_at=today),
        Driver(id="d3", name="Rajesh Verma", license_number="MH-2018-007821", license_category="HTV", license_expiry_date=date.fromisoformat("2026-02-01"), contact_number="+91 98111 22233", safety_score=Decimal("74"), status="Suspended", created_at=today),
        Driver(id="d4", name="Ganesh Reddy", license_number="TG-2021-002145", license_category="HMV", license_expiry_date=date.fromisoformat("2027-07-01"), contact_number="+91 90000 11122", safety_score=Decimal("95"), status="Available", created_at=today),
        Driver(id="d5", name="Balaji Nair", license_number="KL-2020-009911", license_category="LMV", license_expiry_date=date.fromisoformat("2026-11-01"), contact_number="+91 94444 55566", safety_score=Decimal("90"), status="Available", created_at=today),
        Driver(id="d6", name="Prakash Singh", license_number="DL-2017-003344", license_category="HTV", license_expiry_date=date.fromisoformat("2026-07-20"), contact_number="+91 95555 66677", safety_score=Decimal("78"), status="Off Duty", created_at=today),
        Driver(id="d7", name="Kiran Deshmukh", license_number="MH-2022-008812", license_category="HMV", license_expiry_date=date.fromisoformat("2027-11-01"), contact_number="+91 91111 33344", safety_score=Decimal("89"), status="On Trip", created_at=today),
    ]
    for driver in drivers:
        existing = await db.execute(select(Driver).where(Driver.id == driver.id))
        if not existing.scalar_one_or_none():
            db.add(driver)
    await db.commit()

    # Seed trips
    trips = [
        Trip(id="t1", source="Chennai", destination="Bengaluru", vehicle_id="v2", driver_id="d2", cargo_weight=Decimal("1100"), planned_distance=Decimal("350"), actual_distance=None, revenue=Decimal("45000"), status="Dispatched", dispatched_at=today, completed_at=None, created_at=today),
        Trip(id="t2", source="Mumbai", destination="Pune", vehicle_id="v6", driver_id="d7", cargo_weight=Decimal("900"), planned_distance=Decimal("150"), actual_distance=None, revenue=Decimal("22000"), status="Dispatched", dispatched_at=today, completed_at=None, created_at=today),
        Trip(id="t3", source="Hyderabad", destination="Vijayawada", vehicle_id="v4", driver_id="d4", cargo_weight=Decimal("5200"), planned_distance=Decimal("275"), actual_distance=Decimal("280"), revenue=Decimal("68000"), status="Completed", dispatched_at=datetime.fromisoformat("2026-07-09T00:00:00"), completed_at=datetime.fromisoformat("2026-07-10T00:00:00"), created_at=today),
        Trip(id="t4", source="Coimbatore", destination="Kochi", vehicle_id="v1", driver_id="d5", cargo_weight=Decimal("620"), planned_distance=Decimal("190"), actual_distance=Decimal("195"), revenue=Decimal("28000"), status="Completed", dispatched_at=datetime.fromisoformat("2026-07-07T00:00:00"), completed_at=datetime.fromisoformat("2026-07-08T00:00:00"), created_at=today),
        Trip(id="t5", source="Ahmedabad", destination="Surat", vehicle_id="v5", driver_id="d1", cargo_weight=Decimal("8500"), planned_distance=Decimal("265"), actual_distance=None, revenue=Decimal("72000"), status="Draft", dispatched_at=None, completed_at=None, created_at=today),
    ]
    for trip in trips:
        existing = await db.execute(select(Trip).where(Trip.id == trip.id))
        if not existing.scalar_one_or_none():
            db.add(trip)
    await db.commit()

    # Seed maintenance
    maintenance = [
        MaintenanceLog(id="m1", vehicle_id="v3", opened_at=datetime.fromisoformat("2026-07-08T00:00:00"), closed_at=None, category="Engine", description="Coolant leak diagnosis", cost=Decimal("8500"), status="Open"),
        MaintenanceLog(id="m2", vehicle_id="v4", opened_at=datetime.fromisoformat("2026-06-12T00:00:00"), closed_at=datetime.fromisoformat("2026-06-14T00:00:00"), category="Tyres", description="Rear tyre replacement", cost=Decimal("22000"), status="Closed"),
        MaintenanceLog(id="m3", vehicle_id="v1", opened_at=datetime.fromisoformat("2026-05-12T00:00:00"), closed_at=datetime.fromisoformat("2026-05-13T00:00:00"), category="Service", description="Scheduled 40,000 km service", cost=Decimal("6200"), status="Closed"),
    ]
    for m in maintenance:
        existing = await db.execute(select(MaintenanceLog).where(MaintenanceLog.id == m.id))
        if not existing.scalar_one_or_none():
            db.add(m)
    await db.commit()

    # Seed fuel logs
    fuel = [
        FuelLog(id="f1", vehicle_id="v3", trip_id="t3", liters=Decimal("45"), cost=Decimal("4550"), odometer=Decimal("132500"), logged_at=datetime.fromisoformat("2026-07-10T00:00:00")),
        FuelLog(id="f2", vehicle_id="v1", trip_id="t4", liters=Decimal("22"), cost=Decimal("2220"), odometer=Decimal("45210"), logged_at=datetime.fromisoformat("2026-07-08T00:00:00")),
        FuelLog(id="f3", vehicle_id="v2", trip_id="t1", liters=Decimal("55"), cost=Decimal("5590"), odometer=Decimal("88100"), logged_at=today),
        FuelLog(id="f4", vehicle_id="v4", trip_id=None, liters=Decimal("80"), cost=Decimal("8100"), odometer=Decimal("210300"), logged_at=datetime.fromisoformat("2026-07-02T00:00:00")),
    ]
    for f in fuel:
        existing = await db.execute(select(FuelLog).where(FuelLog.id == f.id))
        if not existing.scalar_one_or_none():
            db.add(f)
    await db.commit()

    # Seed expenses
    expenses = [
        Expense(id="e1", vehicle_id="v3", trip_id="t3", category="Toll", amount=Decimal("1250"), notes="NH-65 toll", incurred_at=datetime.fromisoformat("2026-07-10T00:00:00")),
        Expense(id="e2", vehicle_id="v1", trip_id="t4", category="Loading", amount=Decimal("800"), notes="Kochi port", incurred_at=datetime.fromisoformat("2026-07-08T00:00:00")),
        Expense(id="e3", vehicle_id="v2", trip_id="t1", category="Parking", amount=Decimal("200"), notes="Bengaluru hub", incurred_at=today),
        Expense(id="e4", vehicle_id="v4", trip_id=None, category="Insurance", amount=Decimal("32000"), notes="Annual premium", incurred_at=datetime.fromisoformat("2026-06-27T00:00:00")),
    ]
    for e in expenses:
        existing = await db.execute(select(Expense).where(Expense.id == e.id))
        if not existing.scalar_one_or_none():
            db.add(e)
    await db.commit()
=======
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
>>>>>>> e21946685e62ae18c3f3933d86dd20bdbac55cd8
