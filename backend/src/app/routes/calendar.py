from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from typing import List
from schemas.calendar import CalendarEvent, CalendarEventCreate
from services.calendar import create_event, get_events, get_event, delete_event
from dependencies import get_db, get_current_user

router = APIRouter()

@router.post("/events/", response_model=CalendarEvent)
def create_calendar_event(event: CalendarEventCreate, db: Session = Depends(get_db), user_id: int = Depends(get_current_user)):
    return create_event(db, event, user_id)

@router.get("/events/", response_model=List[CalendarEvent])
def read_calendar_events(db: Session = Depends(get_db), user_id: int = Depends(get_current_user)):
    return get_events(db, user_id)

@router.get("/events/{event_id}", response_model=CalendarEvent)
def read_calendar_event(event_id: int, db: Session = Depends(get_db), user_id: int = Depends(get_current_user)):
    db_event = get_event(db, event_id, user_id)
    if db_event is None:
        raise HTTPException(status_code=404, detail="Event not found")
    return db_event

@router.delete("/events/{event_id}")
def delete_calendar_event(event_id: int, db: Session = Depends(get_db), user_id: int = Depends(get_current_user)):
    success = delete_event(db, event_id, user_id)
    if not success:
        raise HTTPException(status_code=404, detail="Event not found")
    return {"detail": "Event deleted"}