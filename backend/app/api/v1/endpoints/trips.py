from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session

from app.api.v1.deps import require_perm
from app.db.session import get_db
from app.schemas.trip import TripComplete, TripCreate, TripOut, TripUpdate
from app.services import trip_service

router = APIRouter(prefix="/trips", tags=["trips"])


@router.get("", response_model=list[TripOut])
def list_trips(status: str | None = None, db: Session = Depends(get_db), user=Depends(require_perm("trip", "read"))):
    return trip_service.list_trips(db, status)


@router.get("/{trip_id}", response_model=TripOut)
def get_trip(trip_id: int, db: Session = Depends(get_db), user=Depends(require_perm("trip", "read"))):
    return trip_service.get_trip(db, trip_id)


@router.post("", response_model=TripOut)
def create_trip(data: TripCreate, db: Session = Depends(get_db), user=Depends(require_perm("trip", "create"))):
    return trip_service.create_trip(db, data, user.user_id)


@router.put("/{trip_id}", response_model=TripOut)
def update_trip(trip_id: int, data: TripUpdate, db: Session = Depends(get_db), user=Depends(require_perm("trip", "update"))):
    return trip_service.update_trip(db, trip_id, data, user.user_id)


@router.post("/{trip_id}/dispatch", response_model=TripOut)
def dispatch_trip(trip_id: int, db: Session = Depends(get_db), user=Depends(require_perm("trip", "update"))):
    return trip_service.dispatch_trip(db, trip_id, user.user_id)


@router.post("/{trip_id}/complete", response_model=TripOut)
def complete_trip(trip_id: int, data: TripComplete, db: Session = Depends(get_db), user=Depends(require_perm("trip", "update"))):
    return trip_service.complete_trip(db, trip_id, data, user.user_id)


@router.post("/{trip_id}/cancel", response_model=TripOut)
def cancel_trip(trip_id: int, db: Session = Depends(get_db), user=Depends(require_perm("trip", "update"))):
    return trip_service.cancel_trip(db, trip_id, user.user_id)
