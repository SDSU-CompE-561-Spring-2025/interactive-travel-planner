from sqlalchemy.orm import Session
<<<<<<< HEAD
from app.models.trips import Trip
from app.schemas.trips import TripCreate

def create_trip(db: Session, trip: TripCreate, user_id: int):
    db_trip = Trip(
        name=trip.name,
        start_date=trip.start_date,
        end_date=trip.end_date,
        user_id=user_id,
    )
=======
from app.models.trips import Trips
from app.schemas.trips import TripCreate

def create_user_trip(db: Session, trip: TripCreate, user_id: int):
    db_trip = Trips(**trip.dict(), user_id=user_id)
>>>>>>> bc85766232baa31c65e2e29401b3951e42ec4d52
    db.add(db_trip)
    db.commit()
    db.refresh(db_trip)
    return db_trip

<<<<<<< HEAD
def get_trips_by_user(db: Session, user_id: int):
    return db.query(Trip).filter(Trip.user_id == user_id).all()
=======
def get_user_trips(db: Session, user_id: int):
    return db.query(Trips).filter(Trips.user_id == user_id).all()

def get_trip_by_id(db: Session, trip_id: int):
    return db.query(Trips).filter(Trips.id == trip_id).first()

def update_trip(db: Session, trip_id: int, trip_data: TripCreate):
    db_trip = db.query(Trips).filter(Trips.id == trip_id).first()
    if db_trip:
        for key, value in trip_data.dict().items():
            setattr(db_trip, key, value)
        db.commit()
        db.refresh(db_trip)
    return db_trip

def delete_trip(db: Session, trip_id: int):
    db_trip = db.query(Trips).filter(Trips.id == trip_id).first()
    if db_trip:
        db.delete(db_trip)
        db.commit()
    return db_trip
>>>>>>> bc85766232baa31c65e2e29401b3951e42ec4d52
