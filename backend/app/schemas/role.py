from pydantic import BaseModel


class RolePermissionOut(BaseModel):
    role_id: int
    role_name: str
    permissions: list[dict]
