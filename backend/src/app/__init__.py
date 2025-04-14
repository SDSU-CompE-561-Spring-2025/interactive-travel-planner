from fastapi import FastAPI
from routes.calendar import router as calendar_router

app = FastAPI(
    title="Interactive Travel Planner",
    description="Calendar backend",
    version="1.0.0"
)

app.include_router(calendar_router, prefix="/calendar", tags=["Calendar"])