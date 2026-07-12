from pydantic import BaseModel, EmailStr


class UserBase(BaseModel):
    name: str
    email: EmailStr
    role_id: str
    status: str = "Active"


class UserCreate(UserBase):
    password: str


class UserRead(UserBase):
    id: str

    class Config:
        from_attributes = True
