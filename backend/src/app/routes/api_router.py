from fastapi import APIRouter
from app.routes.user import router as user_router

api_router = APIRouter()
api_router.include_router(user_router, prefix="/auth", tags=["auth"])
