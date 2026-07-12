from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session

from app.api.v1.deps import require_perm
from app.db.session import get_db
from app.schemas.fuel_expense import ExpenseCreate, ExpenseOut
from app.services import fuel_expense_service

router = APIRouter(prefix="/expenses", tags=["expenses"])


@router.get("", response_model=list[ExpenseOut])
def list_expenses(
    vehicle_id: int | None = None,
    expense_type: str | None = None,
    db: Session = Depends(get_db),
    user=Depends(require_perm("fuel_expense", "read")),
):
    return fuel_expense_service.list_expenses(db, vehicle_id, expense_type)


@router.post("", response_model=ExpenseOut)
def create_expense(
    data: ExpenseCreate,
    db: Session = Depends(get_db),
    user=Depends(require_perm("fuel_expense", "create")),
):
    return fuel_expense_service.create_expense(db, data, user.user_id)
