from fastapi import APIRouter, Depends

router = APIRouter()
'''
from sqlalchemy.orm import Session

import app.services.category as category_service
import app.services.user as user_service
from app.core.auth import decode_access_token, oauth2_scheme
from app.dependencies import get_db
from app.schemas.category import CategoryCreate, CategoryResponse


router = APIRouter()

@router.post("/", response_model=CategoryResponse)
def create_category(
    category: CategoryCreate,
    db: Session = Depends(get_db),
    token: str = Depends(oauth2_scheme),
):
    username = decode_access_token(token).username
    user = user_service.get_user_by_username(db, username)

    user_id = user.id

    return category_service.create_category(db, category, user_id)'''
