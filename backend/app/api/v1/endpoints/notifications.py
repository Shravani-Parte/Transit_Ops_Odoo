"""notifications.py — HTTP handlers. Delegates to service layer."""
from fastapi import APIRouter, Depends
from app.api.v1.deps import Pagination
from app.core.permissions import require_permission

router = APIRouter()


@router.get("/")
async def list_notifications():
    return []


@router.post("/{nid}/read")
async def mark_read(nid: str):
    return {"ok": True}

