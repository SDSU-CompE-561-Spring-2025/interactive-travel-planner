from fastapi import APIRouter, HTTPException, status
from sqlalchemy.orm import joinedload
from typing import List
from app.deps import db_dependency, user_dependency
from app.schemas.itineraries import ItineraryCreate, ItineraryUpdate, ItineraryResponse
from app.models.itineraries import Itinerary
from app.models.locations import Location
from app.services.itineraries import update_itinerary as _update_itinerary


router = APIRouter(
    prefix='/itineraries',
    tags=['itineraries']
)


@router.get('/{itinerary_id}', response_model=ItineraryResponse)
def get_itinerary(db: db_dependency, user: user_dependency, itinerary_id: int):
    itinerary = (
        db.query(Itinerary)
        .options(joinedload(Itinerary.locations))
        .filter(Itinerary.id == itinerary_id)
        .first()
    )
    if not itinerary:
        raise HTTPException(status_code=404, detail="Itinerary not found")
    return itinerary


@router.get('/', response_model=List[ItineraryResponse])
def get_itineraries(db: db_dependency, user: user_dependency):
    return (
        db.query(Itinerary)
        .options(joinedload(Itinerary.locations))
        .filter(Itinerary.user_id == user.get('id'))
        .all()
    )


@router.post("/", status_code=status.HTTP_201_CREATED, response_model=ItineraryResponse)
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
        from app.models.trips import Trip
        for trip_id in itinerary.trips:
            trip = db.query(Trip).filter(Trip.id == trip_id).first()
            if trip:
                db_itinerary.trips.append(trip)

    # Add locations
    if itinerary.locations:
        for loc_data in itinerary.locations:
            location = Location(
                itinerary_id=db_itinerary.id,
                name=loc_data.name,
                description=loc_data.description,
                latitude=loc_data.coordinates[0],
                longitude=loc_data.coordinates[1]
            )
            db.add(location)

    db.commit()
    db.refresh(db_itinerary)

    # Return the itinerary with locations
    return (
        db.query(Itinerary)
        .options(joinedload(Itinerary.locations))
        .filter(Itinerary.id == db_itinerary.id)
        .first()
    )


@router.put("/{itinerary_id}", response_model=ItineraryResponse)
def update_itinerary(
    db: db_dependency,
    user: user_dependency,
    itinerary_id: int,
    itinerary: ItineraryUpdate
):
    # Verify ownership
    db_itinerary = db.query(Itinerary).filter(
        Itinerary.id == itinerary_id,
        Itinerary.user_id == user.get('id')
    ).first()
    if not db_itinerary:
        raise HTTPException(status_code=404, detail="Itinerary not found")

    updated_itinerary = _update_itinerary(db, itinerary_id, itinerary.dict(exclude_unset=True))
    
    # Return the updated itinerary with locations
    return (
        db.query(Itinerary)
        .options(joinedload(Itinerary.locations))
        .filter(Itinerary.id == updated_itinerary.id)
        .first()
    )


@router.delete("/{itinerary_id}")
def delete_itinerary(db: db_dependency, user: user_dependency, itinerary_id: int):
    db_itinerary = db.query(Itinerary).filter(
        Itinerary.id == itinerary_id,
        Itinerary.user_id == user.get('id')
    ).first()
    if not db_itinerary:
        raise HTTPException(status_code=404, detail="Itinerary not found")
    
    db.delete(db_itinerary)
    db.commit()
    return {"message": "Itinerary deleted successfully"}
