from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session

from app.api.v1.deps import require_perm
from app.db.session import get_db
from app.models.region import Region

router = APIRouter(prefix="/regions", tags=["regions"])


@router.get("")
def list_regions(db: Session = Depends(get_db), user=Depends(require_perm("vehicle", "read"))):
    return db.query(Region).order_by(Region.region_id).all()
