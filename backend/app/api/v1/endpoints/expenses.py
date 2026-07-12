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

