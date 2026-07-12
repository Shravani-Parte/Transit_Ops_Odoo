from datetime import datetime
from pydantic import BaseModel, EmailStr


class LoginRequest(BaseModel):
    email: EmailStr
    password: str


class TokenResponse(BaseModel):
    access_token: str
    token_type: str = "bearer"


class PermissionOut(BaseModel):
    module: str
    action: str

    class Config:
        from_attributes = True


class UserOut(BaseModel):
    user_id: int
    full_name: str
    email: str
    role_id: int
    role_name: str
    permissions: list[PermissionOut] = []

    class Config:
        from_attributes = True
