from fastapi import APIRouter

from app.routes import category, user, trips

api_router = APIRouter()
api_router.include_router(user.router, prefix="/auth", tags=["User"])
api_router.include_router(category.router, prefix="/category", tags=["Category"])
api_router.include_router(trips.router, tags=["Trips"])
