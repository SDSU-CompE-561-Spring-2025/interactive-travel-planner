from fastapi import FastAPI
from routes import calendar

app.include_router(calendar.router, prefix="/calendar", tags=["Calendar"])