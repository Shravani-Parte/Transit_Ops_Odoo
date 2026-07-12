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

