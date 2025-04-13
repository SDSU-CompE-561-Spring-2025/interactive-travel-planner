from sqlalchemy.orm import Session
from app.models.trip import Trip
from app.schemas.calendar import CalendarCreate

def set_trip_dates(db: Session, data: CalendarCreate):
    trip = db.query(Trip).get(data.trip_id)
    if not trip:
        return None

    trip.start_date = data.start_date
    trip.end_date = data.end_date
    db.commit()
    db.refresh(trip)