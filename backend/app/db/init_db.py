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
