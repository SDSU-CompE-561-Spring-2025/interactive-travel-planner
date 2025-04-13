from fastapi import APIRouter
from app.routes.calendar import calendar

api_router = APIRouter()
api_router.include_router(calendar.router, prefix="/api", tags=["calendar"])

# test