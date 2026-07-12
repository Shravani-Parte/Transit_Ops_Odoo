<<<<<<< HEAD
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

=======
from fastapi import APIRouter, Depends, Query
from fastapi.responses import PlainTextResponse, StreamingResponse
from sqlalchemy.orm import Session
import io

from app.api.v1.deps import require_perm
from app.db.session import get_db
from app.schemas.fuel_expense import ExpenseCreate, ExpenseOut, FuelLogCreate, FuelLogOut
from app.schemas.report import DashboardKpis, FuelEfficiencyOut, MonthlyRevenueOut, OperationalCostOut, VehicleRoiOut
from app.services import fuel_expense_service, report_service

router_fuel = APIRouter(prefix="/fuel-logs", tags=["fuel"])
router_expense = APIRouter(prefix="/expenses", tags=["expenses"])
router_reports = APIRouter(prefix="/reports", tags=["reports"])
router_dashboard = APIRouter(prefix="/dashboard", tags=["dashboard"])


@router_fuel.get("", response_model=list[FuelLogOut])
def list_fuel(vehicle_id: int | None = None, db: Session = Depends(get_db), user=Depends(require_perm("fuel_expense", "read"))):
    return fuel_expense_service.list_fuel_logs(db, vehicle_id)


@router_fuel.post("", response_model=FuelLogOut)
def create_fuel(data: FuelLogCreate, db: Session = Depends(get_db), user=Depends(require_perm("fuel_expense", "create"))):
    return fuel_expense_service.create_fuel_log(db, data, user.user_id)


@router_expense.get("", response_model=list[ExpenseOut])
def list_expenses(vehicle_id: int | None = None, expense_type: str | None = None, db: Session = Depends(get_db), user=Depends(require_perm("fuel_expense", "read"))):
    return fuel_expense_service.list_expenses(db, vehicle_id, expense_type)


@router_expense.post("", response_model=ExpenseOut)
def create_expense(data: ExpenseCreate, db: Session = Depends(get_db), user=Depends(require_perm("fuel_expense", "create"))):
    return fuel_expense_service.create_expense(db, data, user.user_id)


@router_dashboard.get("/kpis", response_model=DashboardKpis)
def dashboard_kpis(
    vehicle_type: str | None = None,
    status: str | None = None,
    region_id: int | None = None,
    db: Session = Depends(get_db),
    user=Depends(require_perm("dashboard", "read")),
):
    return report_service.get_dashboard_kpis(db, vehicle_type, status, region_id)


@router_reports.get("/fuel-efficiency", response_model=list[FuelEfficiencyOut])
def fuel_efficiency(db: Session = Depends(get_db), user=Depends(require_perm("reports", "read"))):
    return report_service.get_fuel_efficiency(db)


@router_reports.get("/operational-cost", response_model=list[OperationalCostOut])
def operational_cost(db: Session = Depends(get_db), user=Depends(require_perm("reports", "read"))):
    return report_service.get_operational_costs(db)


@router_reports.get("/roi", response_model=list[VehicleRoiOut])
def vehicle_roi(db: Session = Depends(get_db), user=Depends(require_perm("reports", "read"))):
    return report_service.get_vehicle_roi(db)


@router_reports.get("/monthly-revenue", response_model=list[MonthlyRevenueOut])
def monthly_revenue(db: Session = Depends(get_db), user=Depends(require_perm("reports", "read"))):
    return report_service.get_monthly_revenue(db)


@router_reports.get("/export/{report_type}")
def export_report(
    report_type: str,
    format: str = Query("csv", description="Export format (csv or pdf)"),
    db: Session = Depends(get_db),
    user=Depends(require_perm("reports", "export")),
):
    if format == "pdf":
        pdf_data = report_service.export_pdf(db, report_type)
        return StreamingResponse(
            io.BytesIO(pdf_data),
            media_type="application/pdf",
            headers={"Content-Disposition": f"attachment; filename={report_type}.pdf"},
        )
    else:
        csv_data = report_service.export_csv(db, report_type)
        return PlainTextResponse(
            csv_data,
            media_type="text/csv",
            headers={"Content-Disposition": f"attachment; filename={report_type}.csv"},
        )
>>>>>>> e21946685e62ae18c3f3933d86dd20bdbac55cd8
