"""users.py — HTTP handlers. Delegates to service layer."""
from fastapi import APIRouter, Depends
from app.api.v1.deps import Pagination
from app.core.permissions import require_permission

router = APIRouter()


@router.get("/")
async def list_users(pg: Pagination = Depends()):
    return {"items": [], "page": pg.page, "size": pg.size, "total": 0}


@router.post("/")
async def create_user(_=Depends(require_permission("users", "full"))):
    return {}

