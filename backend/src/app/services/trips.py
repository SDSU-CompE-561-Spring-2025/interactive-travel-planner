from sqlalchemy.orm import Session
from app.models.trips import Trips
from app.schemas.trips import TripCreate

def create_user_trip(db: Session, trip: TripCreate, user_id: int):
    db_trip = Trip(**trip.dict(), user_id=user_id)
    db.add(db_trip)
    db.commit()
    db.refresh(db_trip)
    return db_trip
