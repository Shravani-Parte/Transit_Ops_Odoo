from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session

from app.api.v1.deps import require_perm
from app.db.session import get_db
from app.schemas.maintenance import MaintenanceCreate, MaintenanceOut
from app.services import maintenance_service

router = APIRouter(prefix="/maintenance", tags=["maintenance"])


@router.get("", response_model=list[MaintenanceOut])
def list_maintenance(status: str | None = None, db: Session = Depends(get_db), user=Depends(require_perm("maintenance", "read"))):
    return maintenance_service.list_maintenance(db, status)


@router.post("", response_model=MaintenanceOut)
def create_maintenance(data: MaintenanceCreate, db: Session = Depends(get_db), user=Depends(require_perm("maintenance", "create"))):
    return maintenance_service.create_maintenance(db, data, user.user_id)


@router.post("/{maintenance_id}/close", response_model=MaintenanceOut)
def close_maintenance(maintenance_id: int, db: Session = Depends(get_db), user=Depends(require_perm("maintenance", "update"))):
    return maintenance_service.close_maintenance(db, maintenance_id, user.user_id)
