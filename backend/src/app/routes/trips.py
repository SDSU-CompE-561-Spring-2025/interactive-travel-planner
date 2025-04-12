from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from app.dependencies import get_db
from app.schemas.trips import Trip, TripCreate
import app.services.trips as trip

router = APIRouter()

@router.get("/users/{id}/trips", response_model=list[Trip])
def get_user_trips(id: int, db: Session = Depends(get_db)):
    return trip.get_user_trips(db, user_id=id)


@router.post("/users/{id}/trips", response_model=Trip)
def create_trip(id: int, trip_data: TripCreate, db: Session = Depends(get_db)):
    return trip.create_user_trip(db, trip=trip_data, user_id=id)



@router.get("/trips/{trip_id}", response_model=Trip)
def get_trip(trip_id: int, db: Session = Depends(get_db)):
    db_trip = trip.get_trip_by_id(db, trip_id)
    if not db_trip:
        raise HTTPException(status_code=404, detail="Trip not found")
    return db_trip

@router.put("/trips/{trip_id}", response_model=Trip)
def update_trip(trip_id: int, trip: TripCreate, db: Session = Depends(get_db)):
    db_trip = trip.update_trip(db, trip_id, trip)
    if not db_trip:
        raise HTTPException(status_code=404, detail="Trip not found")
    return db_trip

@router.delete("/trips/{trip_id}")
def delete_trip(trip_id: int, db: Session = Depends(get_db)):
    db_trip = trip.delete_trip(db, trip_id)
    if not db_trip:
        raise HTTPException(status_code=404, detail="Trip not found")
    return {"message": f"Trip {trip_id} deleted successfully"}
