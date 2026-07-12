"""vehicle_documents.py — HTTP handlers. Delegates to service layer."""
from fastapi import APIRouter, Depends
from app.api.v1.deps import Pagination
from app.core.permissions import require_permission

router = APIRouter()


@router.get("/{vid}")
async def list_documents(vid: str):
    return []


@router.post("/{vid}")
async def upload_document(vid: str):
    return {}

