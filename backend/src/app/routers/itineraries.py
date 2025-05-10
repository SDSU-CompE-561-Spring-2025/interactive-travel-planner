from pydantic import BaseModel
from typing import Optional
from fastapi import APIRouter, status
from app.schemas.itineraries import ItineraryCreate
from app.models.itineraries import Itinerary
from app.deps import db_dependency, user_dependency


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
    db_itinerary = Itinerary(**itinerary.model_dump(), user_id=user.get('id'))
    db.add(db_itinerary)
    db.commit()
    db.refresh(db_itinerary)
    return db_itinerary

@router.delete("/")
def delete_itinerary(db: db_dependency, user: user_dependency, itinerary_id: int):
    db_itinerary = db.query(Itinerary).filter(Itinerary.id == itinerary_id).first()
    if db_itinerary:
        db.delete(db_itinerary)
        db.commit()
    return db_itinerary
