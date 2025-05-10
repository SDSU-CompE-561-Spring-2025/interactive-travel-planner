from pydantic import BaseModel
from typing import List, Optional
from fastapi import APIRouter
from sqlalchemy.orm import joinedload
from app.models.trips import Trip
from app.models.itineraries import Itinerary
from app.deps import db_dependency, user_dependency
from app.schemas.trips import TripCreate

router = APIRouter(
    prefix='/trips',
    tags=['trips']
)


@router.get("/")
def get_trips(db: db_dependency, user: user_dependency):
    return db.query(Trip).options(joinedload(Trip.itineraries)).filter(Trip.user_id == user.get('id')).all()



@router.post("/")
def create_trip(db: db_dependency, user: user_dependency, trip: TripCreate):
    db_trip = Trip(name=trip.name, description=trip.description, user_id=user.get('id'))
    for itinerary_id in trip.itineraries:
        itinerary = db.query(Itinerary).filter(Itinerary.id == itinerary_id).first()
        if itinerary:
            db_trip.itineraries.append(itinerary)
    db.add(db_trip)
    db.commit()
    db.refresh(db_trip)
    db_trips = db.query(Trip).options(joinedload(Trip.itineraries)).filter(Trip.id == db_trip.id).first()
    return db_trips

@router.delete('/')
def delete_trip(db: db_dependency, user: user_dependency, trip_id: int):
    db_trip = db.query(Trip).filter(Trip.id == trip_id).first()
    if db_trip:
        db.delete(db_trip)
        db.commit()
    return db_trip
