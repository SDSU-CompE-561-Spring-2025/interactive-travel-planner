from sqlalchemy.orm import Session
from app.models.itinerary import Itinerary
from app.schemas.itinerary import ItineraryCreate

def create_itinerary(db: Session, itinerary: ItineraryCreate, trip_id: int):
    db_itinerary = Itinerary(
        trip_id=trip_id,
        name=itinerary.name,
        time=itinerary.time,
        description=itinerary.description,
        location=itinerary.location,
    )
    db.add(db_itinerary)
    db.commit()
    db.refresh(db_itinerary)
    return db_itinerary

def get_itineraries_by_trip(db: Session, trip_id: int):
    return db.query(Itinerary).filter(Itinerary.trip_id == trip_id).all()
