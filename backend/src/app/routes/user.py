from fastapi import APIRouter, Depends
from fastapi.security import OAuth2PasswordRequestForm

from app.core.auth import ACCESS_TOKEN_EXPIRE_MINUTES, create_access_token
from app.schemas.token import Token
from app.schemas.user import UserOut
from app.schemas.user import UserResponse, UserCreate
import app.services.user as user_service
from app.dependencies import get_db, get_current_user
from sqlalchemy.orm import Session
from fastapi import HTTPException, status
from datetime import timedelta
from app.models.user import User

router = APIRouter()

@router.post("/register", response_model=UserResponse)
def register_user(user: UserCreate, db: Session = Depends(get_db)):
    new_user = user_service.create_user(db=db, user=user)
    return new_user


@router.post("/token", response_model=Token)
async def login_for_access_token(
    form_data: OAuth2PasswordRequestForm = Depends(), db: Session = Depends(get_db)
):
    user = user_service.authenticate_user(
        db, username=form_data.username, password=form_data.password
    )

    if not user:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Incorrect username or password",
            headers={"WWW-Authenticate": "Bearer"},
        )

    access_token_expires = timedelta(minutes=ACCESS_TOKEN_EXPIRE_MINUTES)
    access_token = create_access_token(
        data={"sub": user.username}, expires_delta=access_token_expires
    )
    return {"access_token": access_token, "token_type": "bearer"}


@router.get("/users/{userID}", response_model=UserResponse)
def get_user(id: int, db: Session = Depends(get_db)):
    current_user = user_service.get_user_by_id(db=db, id=id)
    if not current_user:
        raise HTTPException(status_code=404, detail="User not found")
    print(f"[✅] user successfully loged in: id={current_user.id}, username={current_user.username}")
    return current_user



@router.post("/users/verify-email/{verification_code}")
def verify_email(verification_code: str):
    return {"message": "Email verified successfully"}
