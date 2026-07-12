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
