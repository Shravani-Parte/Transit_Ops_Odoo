from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session

from app.api.v1.deps import get_current_user, require_perm
from app.db.session import get_db
from app.models.org_settings import OrgSettings
from app.models.region import Region
from app.schemas.region import RegionOut
from app.services import auth_service

router = APIRouter(tags=["misc"])


@router.get("/regions", response_model=list[RegionOut])
def list_regions(db: Session = Depends(get_db), user=Depends(get_current_user)):
    return db.query(Region).all()


@router.get("/roles/permissions")
def role_permissions(db: Session = Depends(get_db), user=Depends(require_perm("settings", "read"))):
    return auth_service.get_role_permissions_matrix(db)


@router.get("/settings")
def get_settings(db: Session = Depends(get_db), user=Depends(get_current_user)):
    s = db.query(OrgSettings).first()
    if not s:
        s = OrgSettings()
        db.add(s)
        db.commit()
    return {"depot_name": s.depot_name, "currency": s.currency, "distance_unit": s.distance_unit}


@router.put("/settings")
def update_settings(data: dict, db: Session = Depends(get_db), user=Depends(require_perm("settings", "update"))):
    s = db.query(OrgSettings).first()
    if not s:
        s = OrgSettings()
        db.add(s)
    for k in ("depot_name", "currency", "distance_unit"):
        if k in data:
            setattr(s, k, data[k])
    db.commit()
    return {"depot_name": s.depot_name, "currency": s.currency, "distance_unit": s.distance_unit}
