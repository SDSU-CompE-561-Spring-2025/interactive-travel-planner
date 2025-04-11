from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from app.dependencies import get_db
from app.schemas.trips import Trip, TripCreate
from app.crud import trips as trip_crud

router = APIRouter()

@router.get("/users/{id}/trips", response_model=list[Trip])
def get_user_trips(id: int, db: Session = Depends(get_db)):
    return trip_crud.get_user_trips(db, user_id=id)

@router.post("/users/{id}/trips")
def create_trip(id: int, db: Session = Depends(get_db)):
    return {"message": f"Trip created for user {id}"}

@router.get("/trips/{trip_id}")
def get_trip(trip_id: int, db: Session = Depends(get_db)):
    return {"message": f"Trip {trip_id} returned successfully"}

@router.put("/trips/{trip_id}")
def update_trip(trip_id: int, db: Session = Depends(get_db)):
    return {"message": f"Trip {trip_id} updated successfully"}

@router.delete("/trips/{trip_id}")
def delete_trip(trip_id: int, db: Session = Depends(get_db)):
    return {"message": f"Trip {trip_id} deleted successfully"}
