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
