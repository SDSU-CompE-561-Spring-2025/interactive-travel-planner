from sqlalchemy.orm import Session
from app.models import Collaboration
from app.schemas import CollaborationCreate

def create_collaboration(db: Session, collab: CollaborationCreate):
    db_collab = Collaboration(**collab.dict())
    db.add(db_collab)
    db.commit()
    db.refresh(db_collab)
    return db_collab

def get_collaborations_by_trip(db: Session, trip_id: init):
    return db.query(Collaboration).filter(Collaboration.trip_id == trip_id).all()