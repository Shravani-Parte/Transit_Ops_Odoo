from pydantic import BaseModel


class PermissionRead(BaseModel):
    id: str
    module: str
    action: str

    class Config:
        from_attributes = True


class RolePermissionMatrix(BaseModel):
    role: str
    permissions: list[PermissionRead]
