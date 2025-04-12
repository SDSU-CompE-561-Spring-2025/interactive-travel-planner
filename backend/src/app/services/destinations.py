from sqlalchemy.orm import Session
from app.models.destinations import Destination
from app.schemas.destinations import DestinationCreate

def get_destinations_by_trip(trip_id: int, db: Session):
    return db.query(Destination).filter(Destination.trip_id == trip_id).all()
