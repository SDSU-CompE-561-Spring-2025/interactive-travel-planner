# app/routes/destinations.py

from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from app.dependencies import get_db
from app.models.destinations import Destinations
from app.schemas.destinations import DestinationCreate, DestinationRead

router = APIRouter()


@router.get("/trips/{trip_id}/destinations", response_model=list[DestinationRead])
def get_trip_destinations(trip_id: int, db: Session = Depends(get_db)):
    destinations = db.query(Destinations).filter(Destinations.trip_id == trip_id).all()
    return destinations


@router.post("/trips/{trip_id}/destinations", response_model=DestinationRead)
def create_trip_destination(trip_id: int, destination: DestinationCreate, db: Session = Depends(get_db)):
    new_dest = Destinations(**destination.dict(), trip_id=trip_id)
    db.add(new_dest)
    db.commit()
    db.refresh(new_dest)
    return new_dest


@router.get("/destinations/{destination_id}", response_model=DestinationRead)
def get_destination(destination_id: int, db: Session = Depends(get_db)):
    dest = db.query(Destinations).filter(Destinations.id == destination_id).first()
    if not dest:
        raise HTTPException(status_code=404, detail="Destination not found")
    return dest


@router.put("/destinations/{destination_id}", response_model=DestinationRead)
def update_destination(destination_id: int, update_data: DestinationCreate, db: Session = Depends(get_db)):
    dest = db.query(Destinations).filter(Destinations.id == destination_id).first()
    if not dest:
        raise HTTPException(status_code=404, detail="Destination not found")

    for key, value in update_data.dict().items():
        setattr(dest, key, value)

    db.commit()
    db.refresh(dest)
    return dest


@router.delete("/destinations/{destination_id}")
def delete_destination(destination_id: int, db: Session = Depends(get_db)):
    dest = db.query(Destinations).filter(Destinations.id == destination_id).first()
    if not dest:
        raise HTTPException(status_code=404, detail="Destination not found")

    db.delete(dest)
    db.commit()
    return {"message": f"Destination {destination_id} deleted successfully"}
