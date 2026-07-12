"""reports.py — HTTP handlers. Delegates to service layer."""
from fastapi import APIRouter, Depends
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select
from datetime import datetime
from app.api.v1.deps import get_db
from app.models.vehicle import Vehicle
from app.models.trip import Trip
from app.models.fuel_log import FuelLog
from app.models.maintenance_log import MaintenanceLog

router = APIRouter()


@router.get("/roi")
async def roi(db: AsyncSession = Depends(get_db)):
    """Per-vehicle ROI = (Revenue - (Maintenance + Fuel)) / Acquisition Cost."""
    vehicles_result = await db.execute(select(Vehicle))
    vehicles = vehicles_result.scalars().all()
    roi_data = []
    for v in vehicles:
        # Get revenue from trips
        trips_result = await db.execute(select(Trip).where(Trip.vehicle_id == v.id, Trip.status == "Completed"))
        trips = trips_result.scalars().all()
        total_revenue = sum(t.revenue for t in trips)
        # Get fuel cost
        fuel_result = await db.execute(select(FuelLog).where(FuelLog.vehicle_id == v.id))
        fuel = fuel_result.scalars().all()
        total_fuel = sum(f.cost for f in fuel)
        # Get maintenance cost
        maintenance_result = await db.execute(select(MaintenanceLog).where(MaintenanceLog.vehicle_id == v.id))
        maintenance = maintenance_result.scalars().all()
        total_maintenance = sum(m.cost for m in maintenance)
        # Calculate ROI
        total_cost = total_fuel + total_maintenance
        roi = ((total_revenue - total_cost) / v.acquisition_cost * 100) if v.acquisition_cost > 0 else 0
        roi_data.append({
            "vehicle_id": v.id,
            "registration_number": v.registration_number,
            "total_revenue": float(total_revenue),
            "total_fuel": float(total_fuel),
            "total_maintenance": float(total_maintenance),
            "roi": float(roi)
        })
    return roi_data


@router.get("/fuel-efficiency")
async def fuel_efficiency(db: AsyncSession = Depends(get_db)):
    return []


@router.get("/utilization")
async def utilization(db: AsyncSession = Depends(get_db)):
    return {}


@router.get("/cost")
async def operational_cost(db: AsyncSession = Depends(get_db)):
    return []


@router.get("/revenue")
async def monthly_revenue(db: AsyncSession = Depends(get_db)):
    return []

