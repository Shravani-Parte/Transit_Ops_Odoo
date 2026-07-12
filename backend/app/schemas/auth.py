<<<<<<< HEAD
"""Auth schemas."""
from pydantic import BaseModel, EmailStr
from typing import Optional
=======
from datetime import datetime
from pydantic import BaseModel, EmailStr
>>>>>>> e21946685e62ae18c3f3933d86dd20bdbac55cd8


class LoginRequest(BaseModel):
    email: EmailStr
    password: str


<<<<<<< HEAD
class RegisterRequest(BaseModel):
    name: str
    email: EmailStr
    password: str
    role_name: Optional[str] = "FleetManager"  # Default to FleetManager if not specified


=======
>>>>>>> e21946685e62ae18c3f3933d86dd20bdbac55cd8
class TokenResponse(BaseModel):
    access_token: str
    token_type: str = "bearer"


<<<<<<< HEAD
class MeResponse(BaseModel):
    id: str
    name: str
    email: EmailStr
    role: str
=======
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
>>>>>>> e21946685e62ae18c3f3933d86dd20bdbac55cd8
