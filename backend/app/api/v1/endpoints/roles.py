"""roles.py — HTTP handlers. Delegates to service layer."""
from fastapi import APIRouter, Depends
from app.api.v1.deps import Pagination
from app.core.permissions import require_permission

router = APIRouter()


@router.get("/")
async def list_roles():
    """Read-only role listing. RBAC matrix is displayed by the Settings screen."""
    return []


@router.get("/{role_id}/permissions")
async def role_permissions(role_id: str):
    """Returns (module, action) tuples for the given role."""
    return []

