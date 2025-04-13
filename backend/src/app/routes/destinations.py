from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from app.dependencies import get_db
from app.schemas.destinations import DestinationsCreate, DestinationResponse
from app.models.destinations import Destinations

router = APIRouter()

@router.get("/trips/{trip_id}/destinations", response_model = DestinationResponse)
def get_trip_destinations(trip_id: int, db: Session = Depends(get_db)):
    destinations = db.query(Destinations).filter(Destinations.trip_id == trip_id).all()

    if not destinations:
        raise HTTPException(
            status_code = status.HTTP_404_NOT_FOUND,
            detail = f"Destination for {trip_id} not found")

    return destinations
    return {"message": f"Destination {destination_id} returned successfully"}

@router.post("/trips/{trip_id}/destinations", response_model = DestinationResponse)
def create_trip_destination(trip_id: int, db: Session = Depends(get_db)):
    destinations = Destinations(**destination.dict(), trip_id = trip_id)

    trip = db.query(TripModel).get(trip_id)
    if not trip:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"Trip with ID {trip_id} not found"
        )

    db.add(destinations)
    db.commit()
    db.refresh(destinations)
    return DestinationResponse

@router.get("/destinations/{destination_id}")
def get_destination(destination_id: int, db: Session = Depends(get_db)):
    destinations = db.query(Destinations).get(destination_id)

    if not destinations:
        raise HTTPException(
            status_code = status.HTTP_404_NOT_FOUND,
            detail = f"Destination for {trip_id} not found")

    return destinations


@router.put("/destinations/{destination_id}")
def update_destination(destination_id: int, db: Session = Depends(get_db)):
    destinations = db.query(Destinations).get(destination_id)

    if not destinations:
        raise HTTPException(
            status_code = status.HTTP_404_NOT_FOUND,
            detail = f"Destination for {trip_id} not found")

    for key, value in update_destination.dict().items():
        setattr(destination, key, value)

    db.commit()
    db.refresh(destinations)

    return destinations


@router.delete("/destinations/{destination_id}")
def delete_destination(destination_id: int, db: Session = Depends(get_db)):
    destinations = db.query(Destinations).get(destination_id)

    if not destinations:
        raise HTTPException(
            status_code = status.HTTP_404_NOT_FOUND,
            detail = f"Destination for {trip_id} not found")

    db.delete(destinations)
    db.commit()

    return None
