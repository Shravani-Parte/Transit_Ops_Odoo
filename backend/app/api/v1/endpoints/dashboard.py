"""dashboard.py — HTTP handlers. Delegates to service layer."""
from fastapi import APIRouter, Depends
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select, func
from datetime import datetime, timedelta
from decimal import Decimal
from app.api.v1.deps import get_db
from app.schemas.dashboard import DashboardKPIs
from app.models.vehicle import Vehicle
from app.models.driver import Driver
from app.models.fuel_log import FuelLog
from app.models.maintenance_log import MaintenanceLog
from app.models.expense import Expense

router = APIRouter()


@router.get("/kpis", response_model=DashboardKPIs)
async def kpis(db: AsyncSession = Depends(get_db)):
    """Return DashboardKPIs."""
    # Vehicles
    vehicles_result = await db.execute(select(Vehicle))
    vehicles = vehicles_result.scalars().all()
    active_vehicles = [v for v in vehicles if v.status != "Retired"]
    available_vehicles = len([v for v in vehicles if v.status == "Available"])
    on_trip_vehicles = len([v for v in vehicles if v.status == "On Trip"])
    in_shop_vehicles = len([v for v in vehicles if v.status == "In Shop"])
    fleet_utilization = Decimal((on_trip_vehicles / len(active_vehicles)) * 100) if active_vehicles else Decimal("0.00")

    # Drivers
    drivers_result = await db.execute(select(Driver))
    drivers = drivers_result.scalars().all()
    drivers_available = len([d for d in drivers if d.status == "Available"])
    drivers_on_trip = len([d for d in drivers if d.status == "On Trip"])

    # Expenses
    today_start = datetime.utcnow().replace(hour=0, minute=0, second=0, microsecond=0)
    fuel_today_result = await db.execute(select(FuelLog).where(FuelLog.logged_at >= today_start))
    fuel_today = fuel_today_result.scalars().all()
    expenses_today_result = await db.execute(select(Expense).where(Expense.incurred_at >= today_start))
    expenses_today = expenses_today_result.scalars().all()
    todays_expenses = sum(f.cost for f in fuel_today) + sum(e.amount for e in expenses_today)

    # Operational cost (all time)
    fuel_all_result = await db.execute(select(FuelLog))
    fuel_all = fuel_all_result.scalars().all()
    maintenance_all_result = await db.execute(select(MaintenanceLog))
    maintenance_all = maintenance_all_result.scalars().all()
    expenses_all_result = await db.execute(select(Expense))
    expenses_all = expenses_all_result.scalars().all()
    operational_cost = sum(f.cost for f in fuel_all) + sum(m.cost for m in maintenance_all) + sum(e.amount for e in expenses_all)

    # Monthly costs
    month_start = datetime.utcnow().replace(day=1, hour=0, minute=0, second=0, microsecond=0)
    fuel_month_result = await db.execute(select(FuelLog).where(FuelLog.logged_at >= month_start))
    fuel_month = fuel_month_result.scalars().all()
    maintenance_month_result = await db.execute(select(MaintenanceLog).where(MaintenanceLog.opened_at >= month_start))
    maintenance_month = maintenance_month_result.scalars().all()
    monthly_fuel_cost = sum(f.cost for f in fuel_month)
    monthly_maintenance_cost = sum(m.cost for m in maintenance_month)

    return {
        "fleet_utilization": fleet_utilization,
        "available_vehicles": available_vehicles,
        "on_trip_vehicles": on_trip_vehicles,
        "in_shop_vehicles": in_shop_vehicles,
        "drivers_available": drivers_available,
        "drivers_on_trip": drivers_on_trip,
        "todays_expenses": todays_expenses,
        "operational_cost": operational_cost,
        "monthly_fuel_cost": monthly_fuel_cost,
        "monthly_maintenance_cost": monthly_maintenance_cost
    }


@router.get("/filters")
async def filter_options(db: AsyncSession = Depends(get_db)):
    from app.models.vehicle import Vehicle
    from app.models.region import Region
    vehicles_result = await db.execute(select(Vehicle.type).distinct())
    vehicle_types = [v for v in vehicles_result.scalars().all()]
    regions_result = await db.execute(select(Region.name))
    regions = [r for r in regions_result.scalars().all()]
    return {"vehicle_types": vehicle_types, "regions": regions, "statuses": ["Available", "On Trip", "In Shop", "Retired"]}

