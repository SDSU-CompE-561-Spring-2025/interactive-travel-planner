from pydantic import BaseModel
from typing import List, Optional
from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session, joinedload
from ..models.trips import Trip
from ..models.itineraries import Itinerary
from ..deps import db_dependency, user_dependency
from ..schemas.trips import TripCreate, TripUpdate, Trip as TripSchema
from ..schemas.itineraries import Location as LocationSchema
from ..services.trips import update_trip as _update_trip

router = APIRouter(
    prefix='/trips',
    tags=['trips']
)


@router.get("/")
def get_trips(db: db_dependency, user: user_dependency):
    return db.query(Trip).options(joinedload(Trip.itineraries)).filter(Trip.user_id == user.get('id')).all()


@router.get("/{trip_id}", response_model=TripSchema)
def get_trip(trip_id: int, db: db_dependency, user: user_dependency):
    trip = db.query(Trip).options(joinedload(Trip.itineraries)).filter(Trip.id == trip_id, Trip.user_id == user.get('id')).first()
    if not trip:
        raise HTTPException(status_code=404, detail="Trip not found")
    # Aggregate all locations from all itineraries
    destinations = []
    for itin in trip.itineraries:
        for loc in itin.locations:
            destinations.append(loc)
    # Build response dict
    return {
        "id": trip.id,
        "user_id": trip.user_id,
        "name": trip.name,
        "description": trip.description,
        "start_date": trip.start_date,
        "end_date": trip.end_date,
        "itineraries": [itin.id for itin in trip.itineraries],
        "destinations": [LocationSchema.from_orm(loc) for loc in destinations],
    }


@router.post("/")
def create_trip(db: db_dependency, user: user_dependency, trip: TripCreate):
    db_trip = Trip(
        name=trip.name,
        description=trip.description,
        user_id=user.get('id'),
        start_date=trip.start_date,
        end_date=trip.end_date
    )
    for itinerary_id in trip.itineraries:
        itinerary = db.query(Itinerary).filter(Itinerary.id == itinerary_id).first()
        if itinerary:
            db_trip.itineraries.append(itinerary)
    db.add(db_trip)
    db.commit()
    db.refresh(db_trip)
    db_trips = db.query(Trip).options(joinedload(Trip.itineraries)).filter(Trip.id == db_trip.id).first()
    return db_trips

@router.put("/")
def update_trip(trip_id: int, trip_data: TripUpdate, db: db_dependency):
    db_trip = _update_trip(db, trip_id, trip_data)
    if not db_trip:
        raise HTTPException(status_code=404, detail="Trip not found")
    return db_trip

@router.delete('/')
def delete_trip(db: db_dependency, user: user_dependency, trip_id: int):
    db_trip = db.query(Trip).filter(Trip.id == trip_id).first()
    if db_trip:
        db.delete(db_trip)
        db.commit()
    return db_trip
