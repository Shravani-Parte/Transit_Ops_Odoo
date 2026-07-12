<<<<<<< HEAD
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

=======
from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session

from app.api.v1.deps import require_perm
from app.db.session import get_db
from app.schemas.driver import DriverCreate, DriverOut, DriverStatusHistoryOut, DriverUpdate
from app.services import driver_service

router = APIRouter(prefix="/drivers", tags=["drivers"])


@router.get("", response_model=list[DriverOut])
def list_drivers(
    status: str | None = None,
    search: str | None = None,
    available_only: bool = False,
    db: Session = Depends(get_db),
    user=Depends(require_perm("driver", "read")),
):
    if available_only:
        return driver_service.get_available_drivers(db)
    return driver_service.list_drivers(db, status, search)


@router.get("/{driver_id}", response_model=DriverOut)
def get_driver(driver_id: int, db: Session = Depends(get_db), user=Depends(require_perm("driver", "read"))):
    return driver_service.get_driver(db, driver_id)


@router.post("", response_model=DriverOut)
def create_driver(data: DriverCreate, db: Session = Depends(get_db), user=Depends(require_perm("driver", "create"))):
    return driver_service.create_driver(db, data, user.user_id)


@router.put("/{driver_id}", response_model=DriverOut)
def update_driver(driver_id: int, data: DriverUpdate, db: Session = Depends(get_db), user=Depends(require_perm("driver", "update"))):
    return driver_service.update_driver(db, driver_id, data, user.user_id)


@router.delete("/{driver_id}")
def delete_driver(driver_id: int, db: Session = Depends(get_db), user=Depends(require_perm("driver", "delete"))):
    driver_service.delete_driver(db, driver_id)
    return {"message": "Driver deleted"}


@router.get("/{driver_id}/status-history", response_model=list[DriverStatusHistoryOut])
def status_history(driver_id: int, db: Session = Depends(get_db), user=Depends(require_perm("driver", "read"))):
    return driver_service.get_status_history(db, driver_id)
>>>>>>> e21946685e62ae18c3f3933d86dd20bdbac55cd8
