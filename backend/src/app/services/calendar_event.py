from sqlalchemy.orm import Session
from app.models.calendar_event import CalendarEvent
from app.schemas.calendar_event import CalendarEventCreate

def create_event(db: Session, event: CalendarEventCreate, user_id: int):
    db_event = CalendarEvent(**event.dict(), user_id=user_id)
    db.add(db_event)
    db.commit()
    db.refresh(db_event)
    return db_event

def get_events(db: Session, user_id: int):
    return db.query(CalendarEvent).filter(CalendarEvent.user_id == user_id).all()

def get_event(db: Session, event_id: int, user_id:int):
    return db.query(CalendarEvent).filter(CalendarEvent.id == event_id, CalendarEvent.user_id == user_id).first()

def delete_event(db: Session, event_id: int, user_id: int):
    event = get_event(db, event_id, user_id)
    if event:
        db.delete(event)
        db.commit()
        return True
    return False