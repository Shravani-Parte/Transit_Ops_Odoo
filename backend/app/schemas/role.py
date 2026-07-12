from pydantic import BaseModel


class RoleRead(BaseModel):
    id: str
    name: str
    description: str | None = None

    class Config:
        from_attributes = True
