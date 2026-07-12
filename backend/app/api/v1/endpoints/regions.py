<<<<<<< HEAD
"""regions.py — HTTP handlers. Delegates to service layer."""
from fastapi import APIRouter, Depends
from app.api.v1.deps import Pagination
from app.core.permissions import require_permission

router = APIRouter()


@router.get("/")
async def list_regions():
    return []

=======
from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session

from app.api.v1.deps import require_perm
from app.db.session import get_db
from app.models.region import Region

router = APIRouter(prefix="/regions", tags=["regions"])


@router.get("")
def list_regions(db: Session = Depends(get_db), user=Depends(require_perm("vehicle", "read"))):
    return db.query(Region).order_by(Region.region_id).all()
>>>>>>> e21946685e62ae18c3f3933d86dd20bdbac55cd8
