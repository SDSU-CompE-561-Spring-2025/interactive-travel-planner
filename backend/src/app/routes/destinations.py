from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from app.dependencies import get_db
from app.schemas.destinations import DestinationCreate, DestinationResponse
from app.models.destinations import Destinations

router = APIRouter()

@router.get("/trips/{trip_id}/destinations", response_model=list[DestinationResponse])
def get_trip_destinations(trip_id: int, db: Session = Depends(get_db)):
    destinations = db.query(Destinations).filter(Destinations.trip_id == trip_id).all()

    if not destinations:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"No destinations found for trip {trip_id}"
        )

    return destinations

@router.post("/trips/{trip_id}/destinations", response_model=DestinationResponse)
def create_trip_destination(
    trip_id: int,
    destination_data: DestinationCreate,
    db: Session = Depends(get_db)
):
    from app.models.trips import Trips  # make sure this is imported
    trip = db.query(Trips).get(trip_id)
    if not trip:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"Trip with ID {trip_id} not found"
        )

    destination = Destinations(**destination_data.dict(), trip_id=trip_id)
    db.add(destination)
    db.commit()
    db.refresh(destination)
    return destination

@router.get("/destinations/{destination_id}")
def get_destination(destination_id: int, db: Session = Depends(get_db)):
    destinations = db.query(Destinations).get(destination_id)

    if not destinations:
        raise HTTPException(
            status_code = status.HTTP_404_NOT_FOUND,
            detail = f"Destination for {trip_id} not found")

    return destinations


@router.put("/destinations/{destination_id}", response_model=DestinationResponse)
def update_destination(
    destination_id: int,
    destination_data: DestinationCreate,
    db: Session = Depends(get_db)
):
    destinations = db.query(Destinations).get(destination_id)

    if not destinations:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"Destination with ID {destination_id} not found"
        )

    for key, value in destination_data.dict().items():
        setattr(destinations, key, value)

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
