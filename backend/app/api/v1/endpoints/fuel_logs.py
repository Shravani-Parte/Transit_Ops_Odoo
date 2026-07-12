<<<<<<< HEAD
"""fuel_logs.py — HTTP handlers. Delegates to service layer."""
from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select
from datetime import datetime
from app.api.v1.deps import Pagination, get_db
from app.schemas.fuel_expense import FuelLogRead, FuelLogCreate
from app.models.fuel_log import FuelLog

router = APIRouter()


@router.get("/", response_model=dict)
async def list_fuel_logs(pg: Pagination = Depends(), db: AsyncSession = Depends(get_db)):
    query = select(FuelLog).offset(pg.offset).limit(pg.size)
    result = await db.execute(query)
    items = result.scalars().all()
    count_result = await db.execute(select(FuelLog.id))
    total = len(count_result.scalars().all())
    return {"items": items, "page": pg.page, "size": pg.size, "total": total}


@router.post("/", response_model=FuelLogRead)
async def create_fuel_log(fuel_in: FuelLogCreate, db: AsyncSession = Depends(get_db)):
    import uuid
    db_fuel = FuelLog(
        id=str(uuid.uuid4()),
        **fuel_in.model_dump(),
        logged_at=datetime.utcnow()
    )
    db.add(db_fuel)
    await db.commit()
    await db.refresh(db_fuel)
    return db_fuel

=======
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
>>>>>>> e21946685e62ae18c3f3933d86dd20bdbac55cd8
