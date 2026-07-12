<<<<<<< HEAD
"""auth_service — primary business-rule enforcement layer.

DB triggers in database/triggers_views.sql provide a second, defense-in-depth
layer (per resolved diff #5) — not the primary one.
"""
from typing import Any


class AuthService:
    """Placeholder — wire up when the runtime is connected."""

    async def list(self, *args: Any, **kwargs: Any) -> list:
        return []

    async def get(self, entity_id: str) -> Any | None:
        return None

    async def create(self, data: Any) -> Any:
        raise NotImplementedError

    async def update(self, entity_id: str, data: Any) -> Any:
        raise NotImplementedError

    async def delete(self, entity_id: str) -> None:
        raise NotImplementedError
=======
from datetime import date, datetime, timezone

from sqlalchemy.orm import Session

from app.core.exceptions import NotFoundError, ValidationError
from app.core.permissions import get_user_permissions
from app.core.security import create_access_token, get_password_hash, verify_password
from app.models.permission import Permission
from app.models.role import Role
from app.models.role_permission import RolePermission
from app.models.user import User
from app.schemas.auth import PermissionOut, UserOut


def authenticate_user(db: Session, email: str, password: str) -> User:
    user = db.query(User).filter(User.email == email, User.is_active == True).first()
    if not user or not verify_password(password, user.password_hash):
        raise ValidationError("Invalid email or password")
    user.last_login_at = datetime.now(timezone.utc)
    db.commit()
    return user


def build_user_out(db: Session, user: User) -> UserOut:
    perms = get_user_permissions(db, user)
    role = db.query(Role).filter(Role.role_id == user.role_id).first()
    return UserOut(
        user_id=user.user_id,
        full_name=user.full_name,
        email=user.email,
        role_id=user.role_id,
        role_name=role.role_name if role else "",
        permissions=[PermissionOut(module=m, action=a) for m, a in sorted(perms)],
    )


def login(db: Session, email: str, password: str) -> dict:
    user = authenticate_user(db, email, password)
    token = create_access_token(user.user_id, {"role_id": user.role_id})
    return {"access_token": token, "user": build_user_out(db, user)}


def get_role_permissions_matrix(db: Session) -> list[dict]:
    roles = db.query(Role).all()
    result = []
    for role in roles:
        perms = (
            db.query(Permission)
            .join(RolePermission, RolePermission.permission_id == Permission.permission_id)
            .filter(RolePermission.role_id == role.role_id)
            .all()
        )
        result.append({
            "role_id": role.role_id,
            "role_name": role.role_name,
            "permissions": [{"module": p.module, "action": p.action} for p in perms],
        })
    return result
>>>>>>> e21946685e62ae18c3f3933d86dd20bdbac55cd8
