<<<<<<< HEAD
"""expenses.py — HTTP handlers. Delegates to service layer."""
from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select
from datetime import datetime
from app.api.v1.deps import Pagination, get_db
from app.schemas.fuel_expense import ExpenseRead, ExpenseCreate
from app.models.expense import Expense

router = APIRouter()


@router.get("/", response_model=dict)
async def list_expenses(pg: Pagination = Depends(), db: AsyncSession = Depends(get_db)):
    query = select(Expense).offset(pg.offset).limit(pg.size)
    result = await db.execute(query)
    items = result.scalars().all()
    count_result = await db.execute(select(Expense.id))
    total = len(count_result.scalars().all())
    return {"items": items, "page": pg.page, "size": pg.size, "total": total}


@router.post("/", response_model=ExpenseRead)
async def create_expense(expense_in: ExpenseCreate, db: AsyncSession = Depends(get_db)):
    import uuid
    db_expense = Expense(
        id=str(uuid.uuid4()),
        **expense_in.model_dump(),
        incurred_at=datetime.utcnow()
    )
    db.add(db_expense)
    await db.commit()
    await db.refresh(db_expense)
    return db_expense

=======
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
>>>>>>> e21946685e62ae18c3f3933d86dd20bdbac55cd8
