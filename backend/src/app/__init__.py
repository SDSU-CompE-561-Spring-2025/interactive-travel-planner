fromt fastapi import APIRouter
from app.routers import collaboration

api_router = APIRouter()
api_router.include_router(collaboration.router, prefix="/api", tags=["collaboration"])
