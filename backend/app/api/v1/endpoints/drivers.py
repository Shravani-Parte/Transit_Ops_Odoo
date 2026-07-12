"""drivers.py — HTTP handlers. Delegates to service layer."""
from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select
from app.api.v1.deps import Pagination, get_db
from app.schemas.driver import DriverRead, DriverCreate, DriverUpdate
from app.models.driver import Driver

router = APIRouter()


@router.get("/", response_model=dict)
async def list_drivers(pg: Pagination = Depends(), db: AsyncSession = Depends(get_db)):
    query = select(Driver).offset(pg.offset).limit(pg.size)
    result = await db.execute(query)
    items = result.scalars().all()
    count_result = await db.execute(select(Driver.id))
    total = len(count_result.scalars().all())
    return {"items": items, "page": pg.page, "size": pg.size, "total": total}


@router.post("/", response_model=DriverRead)
async def create_driver(driver_in: DriverCreate, db: AsyncSession = Depends(get_db)):
    import uuid
    db_driver = Driver(
        id=str(uuid.uuid4()),
        **driver_in.model_dump(),
        safety_score=90,
        status="Available"
    )
    db.add(db_driver)
    await db.commit()
    await db.refresh(db_driver)
    return db_driver


@router.get("/{did}", response_model=DriverRead)
async def get_driver(did: str, db: AsyncSession = Depends(get_db)):
    result = await db.execute(select(Driver).where(Driver.id == did))
    driver = result.scalar_one_or_none()
    if not driver:
        raise HTTPException(status.HTTP_404_NOT_FOUND, "Driver not found")
    return driver


@router.patch("/{did}", response_model=DriverRead)
async def update_driver(did: str, driver_in: DriverUpdate, db: AsyncSession = Depends(get_db)):
    result = await db.execute(select(Driver).where(Driver.id == did))
    driver = result.scalar_one_or_none()
    if not driver:
        raise HTTPException(status.HTTP_404_NOT_FOUND, "Driver not found")
    update_data = driver_in.model_dump(exclude_unset=True)
    for field, value in update_data.items():
        setattr(driver, field, value)
    await db.commit()
    await db.refresh(driver)
    return driver


@router.patch("/{did}/suspend", response_model=DriverRead)
async def suspend_driver(did: str, db: AsyncSession = Depends(get_db)):
    result = await db.execute(select(Driver).where(Driver.id == did))
    driver = result.scalar_one_or_none()
    if not driver:
        raise HTTPException(status.HTTP_404_NOT_FOUND, "Driver not found")
    driver.status = "Suspended"
    await db.commit()
    await db.refresh(driver)
    return driver


@router.patch("/{did}/reinstate", response_model=DriverRead)
async def reinstate_driver(did: str, db: AsyncSession = Depends(get_db)):
    result = await db.execute(select(Driver).where(Driver.id == did))
    driver = result.scalar_one_or_none()
    if not driver:
        raise HTTPException(status.HTTP_404_NOT_FOUND, "Driver not found")
    driver.status = "Available"
    await db.commit()
    await db.refresh(driver)
    return driver


@router.get("/{did}/status-history")
async def driver_status_history(did: str, db: AsyncSession = Depends(get_db)):
    from app.models.driver_status_history import DriverStatusHistory
    result = await db.execute(select(DriverStatusHistory).where(DriverStatusHistory.driver_id == did))
    return result.scalars().all()

