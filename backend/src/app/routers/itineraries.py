from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session, joinedload
from typing import List
from ..deps import db_dependency, user_dependency
from ..schemas.itineraries import (
    ItineraryCreate, 
    ItineraryUpdate, 
    Itinerary,
    LocationCreate,
    TransportationCreate,
    ActivityCreate
)
from ..models.itineraries import Itinerary as ItineraryModel
from ..models.itineraries import Location, Transportation, Activity
from ..models.user import User
from ..services.itineraries import update_itinerary as _update_itinerary

router = APIRouter(
    prefix='/itineraries',
    tags=['itineraries']
)

@router.get('/{itinerary_id}', response_model=Itinerary)
def get_itinerary(itinerary_id: int, db: db_dependency, user: user_dependency):
    itinerary = (
        db.query(ItineraryModel)
        .options(
            joinedload(ItineraryModel.locations),
            joinedload(ItineraryModel.transportation),
            joinedload(ItineraryModel.activities),
            joinedload(ItineraryModel.trips)
        )
        .filter(ItineraryModel.id == itinerary_id)
        .first()
    )
    if not itinerary:
        raise HTTPException(status_code=404, detail="Itinerary not found")
    if itinerary.user_id != user.get('id'):
        raise HTTPException(status_code=403, detail="Not authorized to access this itinerary")
    return itinerary

@router.get('/', response_model=List[Itinerary])
def get_itineraries(db: db_dependency, user: user_dependency):
    return (
        db.query(ItineraryModel)
        .options(
            joinedload(ItineraryModel.locations),
            joinedload(ItineraryModel.transportation),
            joinedload(ItineraryModel.activities),
            joinedload(ItineraryModel.trips)
        )
        .filter(ItineraryModel.user_id == user.get('id'))
        .all()
    )

@router.post("/", status_code=status.HTTP_201_CREATED, response_model=Itinerary)
def create_itinerary(db: db_dependency, user: user_dependency, itinerary: ItineraryCreate):
    # Create the base itinerary
    db_itinerary = ItineraryModel(
        name=itinerary.name,
        description=itinerary.description,
        start_date=itinerary.start_date,
        end_date=itinerary.end_date,
        user_id=user.get('id')
    )
    db.add(db_itinerary)
    db.flush()  # Get the ID without committing

    # Add locations
    for location_data in itinerary.locations:
        location = Location(
            **location_data.dict(),
            itinerary_id=db_itinerary.id
        )
        db.add(location)

    # Add transportation
    for transport_data in itinerary.transportation:
        transport = Transportation(
            **transport_data.dict(),
            itinerary_id=db_itinerary.id
        )
        db.add(transport)

    # Add activities
    for activity_data in itinerary.activities:
        activity = Activity(
            **activity_data.dict(),
            itinerary_id=db_itinerary.id
        )
        db.add(activity)

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

@router.put("/{itinerary_id}", response_model=Itinerary)
def update_itinerary(
    itinerary_id: int,
    payload: ItineraryUpdate,
    db: db_dependency,
    user: user_dependency
):
    # First check if the itinerary exists and belongs to the user
    db_itinerary = db.query(ItineraryModel).filter(
        ItineraryModel.id == itinerary_id,
        ItineraryModel.user_id == user.get('id')
    ).first()
    
    if not db_itinerary:
        raise HTTPException(status_code=404, detail="Itinerary not found")

    # Update basic fields
    update_data = payload.dict(exclude_unset=True)
    for field, value in update_data.items():
        if field not in ['locations', 'transportation', 'activities', 'trips']:
            setattr(db_itinerary, field, value)

    # Update locations
    if 'locations' in update_data:
        # Delete existing locations
        db.query(Location).filter(Location.itinerary_id == itinerary_id).delete()
        # Add new locations
        for location_data in update_data['locations']:
            location = Location(**location_data.dict(), itinerary_id=itinerary_id)
            db.add(location)

    # Update transportation
    if 'transportation' in update_data:
        # Delete existing transportation
        db.query(Transportation).filter(Transportation.itinerary_id == itinerary_id).delete()
        # Add new transportation
        for transport_data in update_data['transportation']:
            transport = Transportation(**transport_data.dict(), itinerary_id=itinerary_id)
            db.add(transport)

    # Update activities
    if 'activities' in update_data:
        # Delete existing activities
        db.query(Activity).filter(Activity.itinerary_id == itinerary_id).delete()
        # Add new activities
        for activity_data in update_data['activities']:
            activity = Activity(**activity_data.dict(), itinerary_id=itinerary_id)
            db.add(activity)

    # Update trips
    if 'trips' in update_data:
        from ..models.trips import Trip
        db_itinerary.trips = (
            db.query(Trip)
            .filter(Trip.id.in_(update_data['trips']))
            .all()
        )

    db.commit()
    db.refresh(db_itinerary)
    return db_itinerary

@router.delete("/{itinerary_id}")
def delete_itinerary(itinerary_id: int, db: db_dependency, user: user_dependency):
    db_itinerary = db.query(ItineraryModel).filter(
        ItineraryModel.id == itinerary_id,
        ItineraryModel.user_id == user.get('id')
    ).first()
    
    if not db_itinerary:
        raise HTTPException(status_code=404, detail="Itinerary not found")
    
    db.delete(db_itinerary)
    db.commit()
    return {"message": "Itinerary deleted successfully"}
