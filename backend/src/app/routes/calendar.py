from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from app.database import get_db
from app.schemas.calendar import CalenderCreate, CalendarResponse
from app.crud import calender as crud_calendar

router = APIRouter()