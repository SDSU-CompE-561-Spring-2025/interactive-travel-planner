from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from app.dependencies import get_db
from app.schemas.destinations import Destinations

router = APIRouter()

@router.get("/trips/{trip_id}/destinations")
def get_trip_destinations(trip_id: int, db: Session = Depends(get_db)):
    return {"message": f"Destinations for trip {trip_id} returned successfully"}


@router.post("/trips/{trip_id}/destinations")
def create_trip_destination(trip_id: int, db: Session = Depends(get_db)):
    return {"message": f"Destination created for trip {trip_id}"}

@router.get("/destinations/{destination_id}")
def get_destination(destination_id: int, db: Session = Depends(get_db)):
    return {"message": f"Destination {destination_id} returned successfully"}


@router.put("/destinations/{destination_id}")
def update_destination(destination_id: int, db: Session = Depends(get_db)):
    return {"message": f"Destination {destination_id} updated successfully"}


@router.delete("/destinations/{destination_id}")
def delete_destination(destination_id: int, db: Session = Depends(get_db)):
    return {"message": f"Destination {destination_id} deleted successfully"}
