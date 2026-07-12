from fastapi import APIRouter, Depends
from fastapi.responses import PlainTextResponse
from sqlalchemy.orm import Session

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
def export_csv(report_type: str, db: Session = Depends(get_db), user=Depends(require_perm("reports", "export"))):
    csv_data = report_service.export_csv(db, report_type)
    return PlainTextResponse(csv_data, media_type="text/csv")
