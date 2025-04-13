from fastapi import APIRouter
from app.routers import calendar
from app.routers.calendar import calendar

api_router = APIRouter()
api_router.include_router(calendar.router, prefix="/api", tags=["calendar"])

# test