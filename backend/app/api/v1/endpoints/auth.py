"""auth.py — HTTP handlers. Delegates to service layer."""
from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select
import uuid
from app.api.v1.deps import get_db, get_current_user
from app.schemas.auth import LoginRequest, RegisterRequest, TokenResponse, MeResponse
from app.models.user import User
from app.models.role import Role
from app.core.security import verify_password, hash_password, create_access_token

router = APIRouter()


@router.post("/register", response_model=TokenResponse)
async def register(data: RegisterRequest, db: AsyncSession = Depends(get_db)):
    """Register a new user."""
    # Check if user already exists
    result = await db.execute(select(User).where(User.email == data.email))
    existing_user = result.scalar_one_or_none()
    if existing_user:
        raise HTTPException(status.HTTP_400_BAD_REQUEST, "Email already registered")
    
    # Get the role
    role_result = await db.execute(select(Role).where(Role.name == data.role_name))
    role = role_result.scalar_one_or_none()
    if not role:
        raise HTTPException(status.HTTP_400_BAD_REQUEST, "Invalid role")
    
    # Create new user
    new_user = User(
        id=str(uuid.uuid4()),
        name=data.name,
        email=data.email,
        password_hash=hash_password(data.password),
        role_id=role.id,
        status="Active"
    )
    db.add(new_user)
    await db.commit()
    await db.refresh(new_user)
    
    # Issue token
    return {
        "access_token": create_access_token(subject=new_user.id, extra={"role": role.name}),
        "token_type": "bearer"
    }


@router.post("/login", response_model=TokenResponse)
async def login(data: LoginRequest, db: AsyncSession = Depends(get_db)):
    """Verify credentials, issue JWT."""
    result = await db.execute(select(User).where(User.email == data.email))
    user = result.scalar_one_or_none()
    if not user or not verify_password(data.password, user.password_hash):
        raise HTTPException(status.HTTP_401_UNAUTHORIZED, "Invalid credentials")
    role_result = await db.execute(select(Role).where(Role.id == user.role_id))
    role = role_result.scalar_one_or_none()
    return {
        "access_token": create_access_token(subject=user.id, extra={"role": role.name if role else "FleetManager"}),
        "token_type": "bearer"
    }


@router.post("/logout")
async def logout():
    return {"ok": True}


@router.get("/me", response_model=MeResponse)
async def me(current_user: dict = Depends(get_current_user), db: AsyncSession = Depends(get_db)):
    result = await db.execute(select(User).where(User.id == current_user["sub"]))
    user = result.scalar_one_or_none()
    if not user:
        raise HTTPException(status.HTTP_404_NOT_FOUND, "User not found")
    role_result = await db.execute(select(Role).where(Role.id == user.role_id))
    role = role_result.scalar_one_or_none()
    return {"id": user.id, "name": user.name, "email": user.email, "role": role.name if role else "FleetManager"}

