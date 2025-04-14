from passlib.context import CryptContext
from jose import JWTError, jwt
from fastapi import HTTPException, status

from app.core.config import get_settings


settings = get_settings()
SECRET_KEY = settings.SECRET_KEY
ALGORITHM = settings.JWT_ALGORITHM




pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")


def verify_password(plain_password: str, hashed_password: str):
    return pwd_context.verify(plain_password, hashed_password)


def decode_token(token: str):
    try:
        payload = jwt.decode(token, SECRET_KEY, algorithms=[ALGORITHM])
        username: str = payload.get("sub")
        if username is None:
            raise credentials_exception()
        return username
    except JWTError:
        raise credentials_exception()


def credentials_exception():
    return HTTPException(
        status_code=status.HTTP_401_UNAUTHORIZED,
        detail="Could not validate credentials",
        headers={"WWW-Authenticate": "Bearer"},
    )
