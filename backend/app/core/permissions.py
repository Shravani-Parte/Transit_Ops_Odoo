<<<<<<< HEAD
"""RBAC dependency — reads role_permissions at runtime (RBAC as data, diff #3).

Never hardcode per-endpoint role lists inline. Endpoints declare the
(module, action) they need; this dependency looks up whether the current
user's role has that permission in the role_permissions table.
"""
from fastapi import Depends, HTTPException, status

# from app.api.v1.deps import get_current_user
# from app.crud.crud_role import get_permissions_for_role


def require_permission(module: str, action: str):
    def _dep(user=Depends(lambda: None)):  # placeholder
        if user is None:
            return None
        # perms = get_permissions_for_role(user.role_id)
        # if (module, action) not in perms:
        #     raise HTTPException(status.HTTP_403_FORBIDDEN, "Permission denied")
        return user
    return _dep
=======
from sqlalchemy.orm import Session

from app.core.exceptions import ForbiddenError
from app.models.permission import Permission
from app.models.role_permission import RolePermission
from app.models.user import User


def get_user_permissions(db: Session, user: User) -> set[tuple[str, str]]:
    rows = (
        db.query(Permission.module, Permission.action)
        .join(RolePermission, RolePermission.permission_id == Permission.permission_id)
        .filter(RolePermission.role_id == user.role_id)
        .all()
    )
    return {(r.module, r.action) for r in rows}


def require_permission(db: Session, user: User, module: str, action: str) -> None:
    perms = get_user_permissions(db, user)
    if (module, action) not in perms:
        raise ForbiddenError(f"Missing permission: {module}:{action}")


def has_permission(db: Session, user: User, module: str, action: str) -> bool:
    perms = get_user_permissions(db, user)
    return (module, action) in perms
>>>>>>> e21946685e62ae18c3f3933d86dd20bdbac55cd8
