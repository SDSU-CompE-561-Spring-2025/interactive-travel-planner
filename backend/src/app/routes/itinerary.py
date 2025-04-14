from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from app.models.itinerary import Itinerary
from app.schemas.itinerary import ItineraryCreate, ItineraryRead
from app.dependencies import get_db

# Set up FastAPI router for itinerary-related endpoints
router = APIRouter(
    prefix="",
    tags=["Itinerary"]
)

# Get all itinerary items for a specific trip
@router.get("/trips/{trip_id}/itinerary", response_model=list[ItineraryRead])
def get_trip_itinerary(trip_id: int, db: Session = Depends(get_db)):
    return db.query(Itinerary).filter(Itinerary.trip_id == trip_id).all()

# Create a new itinerary item for a trip
@router.post("/trips/{trip_id}/itinerary", response_model=ItineraryRead)
def create_itinerary_event(trip_id: int, itinerary: ItineraryCreate, db: Session = Depends(get_db)):
    event = Itinerary(**itinerary.dict(), trip_id=trip_id)
    db.add(event)
    db.commit()
    db.refresh(event)
    return event

# Update an existing itinerary item
@router.put("/itinerary/{event_id}", response_model=ItineraryRead)
def update_itinerary_event(event_id: int, update: ItineraryCreate, db: Session = Depends(get_db)):
    event = db.query(Itinerary).filter(Itinerary.id == event_id).first()
    if not event:
        raise HTTPException(status_code=404, detail="Event not found")
    for key, value in update.dict().items():
        setattr(event, key, value)
    db.commit()
    db.refresh(event)
    return event

# Delete an itinerary item
@router.delete("/itinerary/{event_id}")
def delete_itinerary_event(event_id: int, db: Session = Depends(get_db)):
    event = db.query(Itinerary).filter(Itinerary.id == event_id).first()
    if not event:
        raise HTTPException(status_code=404, detail="Event not found")
    db.delete(event)
    db.commit()
    return {"message": f"Event {event_id} deleted"}
