from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session

from app.api.v1.deps import get_current_user, require_perm
from app.db.session import get_db
from app.schemas.auth import LoginRequest, TokenResponse, UserOut
from app.services import auth_service

router = APIRouter(prefix="/auth", tags=["auth"])


@router.post("/login")
def login(data: LoginRequest, db: Session = Depends(get_db)):
    result = auth_service.login(db, data.email, data.password)
    return {"access_token": result["access_token"], "token_type": "bearer", "user": result["user"]}


@router.get("/me", response_model=UserOut)
def me(user=Depends(get_current_user), db: Session = Depends(get_db)):
    return auth_service.build_user_out(db, user)
