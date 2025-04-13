from sqlalchemy.orm import Session
from app.models.trip import Trip
from app.schemas.calendar import CalendarCreate

def set_trip_dates(db: Session, data: CalendarCreate):
    trip = db.query(Trip).get(data.trip_id)
    if not trip:
        return None