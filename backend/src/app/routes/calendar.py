from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from app.database import get_db
from app.schemas.calendar import CalenderCreate, CalendarResponse
from app.crud import calender as crud_calendar

router = APIRouter()

@router.post("/calendar/set-dates", response_model=CalendarResponse)
def set_dates(data: CalendarCreate, db: Session = Depends(get_db)):
    updated_trip = crud_calendar.set_trip_dates(db, data)
    if not updated_trip:
        raise HTTPException(status_code=404, detail="Trip not found")

    return CalendarResponse(
        id=updated_trip.id,
        trip_id=updated_trip.id,
        start_date=updated_trip.start_date,
        end_date=updated_trip.end_date
    )