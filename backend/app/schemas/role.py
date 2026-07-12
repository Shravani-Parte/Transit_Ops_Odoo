from pydantic import BaseModel


<<<<<<< HEAD
class RoleRead(BaseModel):
    id: str
    name: str
    description: str | None = None

    class Config:
        from_attributes = True
=======
class RolePermissionOut(BaseModel):
    role_id: int
    role_name: str
    permissions: list[dict]
>>>>>>> e21946685e62ae18c3f3933d86dd20bdbac55cd8
