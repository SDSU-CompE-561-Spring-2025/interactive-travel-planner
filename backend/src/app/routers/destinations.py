from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session, joinedload
from typing import Optional, List
from ..deps import db_dependency, user_dependency
from ..models.itineraries import Location
from ..schemas.itineraries import LocationCreate, Location as LocationSchema
from ..models.itineraries import Itinerary
from ..models.trips import Trip

router = APIRouter(
    prefix="/destinations",
    tags=["destinations"]
)

@router.get("/", response_model=List[LocationSchema])
def get_destinations(
    db: Session = Depends(db_dependency),
    user: dict = Depends(user_dependency)
):
    """Get all destinations accessible to the user"""
    # Get all itineraries for the user
    itineraries = db.query(Itinerary).filter(Itinerary.user_id == user.get('id')).all()
    itinerary_ids = [i.id for i in itineraries]
    
    # Get all locations from those itineraries
    locations = db.query(Location).filter(Location.itinerary_id.in_(itinerary_ids)).all()
    return locations

@router.get("/{destination_id}", response_model=LocationSchema)
def get_destination(
    destination_id: int,
    db: Session = Depends(db_dependency),
    user: dict = Depends(user_dependency)
):
    """Get a specific destination by ID"""
    # Get the destination and join with itinerary to check ownership
    destination = (
        db.query(Location)
        .join(Itinerary)
        .filter(
            Location.id == destination_id,
            Itinerary.user_id == user.get('id')
        )
        .first()
    )
    
    if not destination:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Destination not found or you don't have access to it"
        )
    
    return destination

@router.post("/", response_model=LocationSchema, status_code=status.HTTP_201_CREATED)
def create_destination(
    destination: LocationCreate,
    db: Session = Depends(db_dependency),
    user: dict = Depends(user_dependency)
):
    try:
        # Optionally associate with an itinerary if trip_id is provided
        itinerary_id = None
        if destination.trip_id:
            # First verify the trip exists and belongs to the user
            trip = db.query(Trip).filter(
                Trip.id == destination.trip_id,
                Trip.user_id == user.get('id')
            ).first()
            
            if not trip:
                raise HTTPException(
                    status_code=status.HTTP_404_NOT_FOUND,
                    detail="Trip not found or you don't have access to it"
                )
            
            # Find an itinerary for this trip and user
            itinerary = db.query(Itinerary).filter(
                Itinerary.user_id == user.get('id')
            ).join(Itinerary.trips).filter(
                Trip.id == destination.trip_id
            ).first()
            
            if not itinerary:
                # If no itinerary exists, create one
                itinerary = Itinerary(
                    name=f"Trip {destination.trip_id} Itinerary",
                    user_id=user.get('id'),
                    start_date=trip.start_date,  # Use trip dates for the itinerary
                    end_date=trip.end_date
                )
                db.add(itinerary)
                db.flush()  # Get the ID without committing
                
                # Associate with the trip
                itinerary.trips.append(trip)
                db.commit()
                db.refresh(itinerary)
            
            itinerary_id = itinerary.id
        
        # Create the location
        db_location = Location(
            name=destination.name,
            coordinates=destination.coordinates.dict(),
            date=destination.date,
            start_date=destination.start_date,
            end_date=destination.end_date,
            color=destination.color,
            comments=destination.comments,
            itinerary_id=itinerary_id
        )
        db.add(db_location)
        db.commit()
        db.refresh(db_location)
        return db_location
        
    except Exception as e:
        db.rollback()
        if isinstance(e, HTTPException):
            raise e
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=str(e)
        ) 