from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session

from app.api.v1.deps import require_perm
from app.db.session import get_db
from app.schemas.fuel_expense import FuelLogCreate, FuelLogOut
from app.services import fuel_expense_service

router = APIRouter(prefix="/fuel-logs", tags=["fuel-logs"])


@router.get("", response_model=list[FuelLogOut])
def list_fuel_logs(
    vehicle_id: int | None = None,
    db: Session = Depends(get_db),
    user=Depends(require_perm("fuel_expense", "read")),
):
    return fuel_expense_service.list_fuel_logs(db, vehicle_id)


@router.post("", response_model=FuelLogOut)
def create_fuel_log(
    data: FuelLogCreate,
    db: Session = Depends(get_db),
    user=Depends(require_perm("fuel_expense", "create")),
):
    return fuel_expense_service.create_fuel_log(db, data, user.user_id)
