"""exports.py — HTTP handlers. Delegates to service layer."""
from fastapi import APIRouter, Depends
from app.api.v1.deps import Pagination
from app.core.permissions import require_permission

router = APIRouter()


@router.get("/csv/{report}")
async def export_csv(report: str, _=Depends(require_permission("reports", "view"))):
    """CSV export (mandatory)."""
    return {"url": ""}


@router.get("/pdf/{report}")
async def export_pdf(report: str, _=Depends(require_permission("reports", "view"))):
    """PDF export (bonus)."""
    return {"url": ""}

