from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session, joinedload
from typing import List
from ..deps import db_dependency, user_dependency
from ..schemas.itineraries import ItineraryCreate, ItineraryUpdate
from ..models.itineraries import Itinerary
from ..models.user import User
from ..services.itineraries import update_itinerary as _update_itinerary


router = APIRouter(
    prefix='/itineraries',
    tags=['itineraries']
)


@router.get('/')
def get_itinerary(db: db_dependency, user: user_dependency, itinerary_id: int):
    return db.query(Itinerary).filter(Itinerary.id == itinerary_id).first()

@router.get('/itineraries')
def get_itineraries(db: db_dependency, user: user_dependency):
    return db.query(Itinerary).all()

@router.post("/", status_code=status.HTTP_201_CREATED)
def create_itinerary(db: db_dependency, user: user_dependency, itinerary: ItineraryCreate):
    db_itinerary = Itinerary(
        name=itinerary.name,
        description=itinerary.description,
        start_date=itinerary.start_date,
        end_date=itinerary.end_date,
        user_id=user.get('id')
    )
    db.add(db_itinerary)
    db.commit()
    db.refresh(db_itinerary)

    # Associate with trips
    if itinerary.trips:
        from ..models.trips import Trip
        for trip_id in itinerary.trips:
            trip = db.query(Trip).filter(Trip.id == trip_id).first()
            if trip:
                db_itinerary.trips.append(trip)
        db.commit()
        db.refresh(db_itinerary)

    return db_itinerary


@router.put("/")
def update_itinerary(itinerary_id: int,payload: ItineraryUpdate, db: db_dependency, user: user_dependency,):
    updated = _update_itinerary(db, itinerary_id, payload)
    if updated.user_id != user.get("id"):
        raise HTTPException(status_code=status.HTTP_403_FORBIDDEN, detail="Not yours")
    return (
        db.query(Itinerary)
            .options(joinedload(Itinerary.trips))
            .filter(Itinerary.id == updated.id)
            .first()
    )


@router.delete("/")
def delete_itinerary(db: db_dependency, user: user_dependency, itinerary_id: int):
    db_itinerary = db.query(Itinerary).filter(Itinerary.id == itinerary_id).first()
    if db_itinerary:
        db.delete(db_itinerary)
        db.commit()
    return db_itinerary
