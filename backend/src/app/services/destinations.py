from sqlalchemy.orm import Session
from app.models.destinations import Destination
from app.schemas.destinations import DestinationCreate

def get_destinations_by_trip(trip_id: int, db: Session):
    return db.query(Destination).filter(Destination.trip_id == trip_id).all()

def create_trip_destination(
    trip_id: int,
    destination_data: DestinationCreate,
    db: Session
):
    destination = Destination(**destination_data.dict(), trip_id=trip_id)
    db.add(destination)
    db.commit()
    db.refresh(destination)
    return destination




def get_destination(destination_id: int, db: Session):
    return db.query(Destination).filter(Destination.id == destination_id).first()


def update_destination(destination_id: int, destination: DestinationCreate, db: Session):
    db_dest = db.query(Destination).filter(Destination.id == destination_id).first()
    if db_dest:
        for key, value in destination.dict().items():
            setattr(db_dest, key, value)
        db.commit()
        db.refresh(db_dest)
    return db_dest

def delete_destination(destination_id: int, db: Session):
    db_dest = db.query(Destination).filter(Destination.id == destination_id).first()
    if db_dest:
        db.delete(db_dest)
        db.commit()
    return db_dest
