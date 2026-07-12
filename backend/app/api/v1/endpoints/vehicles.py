from fastapi import APIRouter, Depends, Query
from sqlalchemy.orm import Session

from app.api.v1.deps import require_perm
from app.db.session import get_db
from app.schemas.vehicle import (
    VehicleCreate,
    VehicleOut,
    VehicleStatusHistoryOut,
    VehicleUpdate,
    VehicleDocumentCreate,
    VehicleDocumentOut,
    VehicleCostSummary
)
from app.services import vehicle_service

router = APIRouter(prefix="/vehicles", tags=["vehicles"])


@router.get("", response_model=list[VehicleOut])
def list_vehicles(
    status: str | None = None,
    vehicle_type: str | None = None,
    region_id: int | None = None,
    search: str | None = None,
    available_only: bool = False,
    db: Session = Depends(get_db),
    user=Depends(require_perm("vehicle", "read")),
):
    if available_only:
        return vehicle_service.get_available_vehicles(db)
    return vehicle_service.list_vehicles(db, status, vehicle_type, region_id, search)


@router.get("/{vehicle_id}", response_model=VehicleOut)
def get_vehicle(vehicle_id: int, db: Session = Depends(get_db), user=Depends(require_perm("vehicle", "read"))):
    return vehicle_service.get_vehicle(db, vehicle_id)


@router.post("", response_model=VehicleOut)
def create_vehicle(data: VehicleCreate, db: Session = Depends(get_db), user=Depends(require_perm("vehicle", "create"))):
    return vehicle_service.create_vehicle(db, data, user.user_id)


@router.put("/{vehicle_id}", response_model=VehicleOut)
def update_vehicle(vehicle_id: int, data: VehicleUpdate, db: Session = Depends(get_db), user=Depends(require_perm("vehicle", "update"))):
    return vehicle_service.update_vehicle(db, vehicle_id, data, user.user_id)


@router.delete("/{vehicle_id}")
def delete_vehicle(vehicle_id: int, db: Session = Depends(get_db), user=Depends(require_perm("vehicle", "delete"))):
    vehicle_service.delete_vehicle(db, vehicle_id)
    return {"message": "Vehicle deleted"}


@router.post("/{vehicle_id}/retire", response_model=VehicleOut)
def retire_vehicle(vehicle_id: int, db: Session = Depends(get_db), user=Depends(require_perm("vehicle", "update"))):
    return vehicle_service.retire_vehicle(db, vehicle_id, user.user_id)


@router.get("/{vehicle_id}/status-history", response_model=list[VehicleStatusHistoryOut])
def status_history(vehicle_id: int, db: Session = Depends(get_db), user=Depends(require_perm("vehicle", "read"))):
    return vehicle_service.get_status_history(db, vehicle_id)


@router.get("/{vehicle_id}/documents", response_model=list[VehicleDocumentOut])
def list_documents(vehicle_id: int, db: Session = Depends(get_db), user=Depends(require_perm("vehicle", "read"))):
    return vehicle_service.list_documents(db, vehicle_id)


@router.post("/{vehicle_id}/documents", response_model=VehicleDocumentOut)
def create_document(
    vehicle_id: int,
    data: VehicleDocumentCreate,
    db: Session = Depends(get_db),
    user=Depends(require_perm("vehicle", "update"))
):
    return vehicle_service.create_document(db, vehicle_id, data, user.user_id)


@router.delete("/{vehicle_id}/documents/{document_id}")
def delete_document(
    vehicle_id: int,
    document_id: int,
    db: Session = Depends(get_db),
    user=Depends(require_perm("vehicle", "update"))
):
    vehicle_service.delete_document(db, vehicle_id, document_id)
    return {"message": "Document deleted"}


@router.get("/{vehicle_id}/cost-summary", response_model=VehicleCostSummary)
def get_cost_summary(vehicle_id: int, db: Session = Depends(get_db), user=Depends(require_perm("vehicle", "read"))):
    return vehicle_service.get_cost_summary(db, vehicle_id)
