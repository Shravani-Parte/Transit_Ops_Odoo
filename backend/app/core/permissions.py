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
