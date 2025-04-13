from sqlalchemy.orm import Session
from app.models.trips import Trip
from app.schemas.trips import TripCreate

def create_trip(db: Session, trip: TripCreate, user_id: int):
    db_trip = Trip(
        name=trip.name,
        start_date=trip.start_date,
        end_date=trip.end_date,
        user_id=user_id,
    )
    db.add(db_trip)
    db.commit()
    db.refresh(db_trip)
    return db_trip

def get_trips_by_user(db: Session, user_id: int):
    return db.query(Trip).filter(Trip.user_id == user_id).all()
