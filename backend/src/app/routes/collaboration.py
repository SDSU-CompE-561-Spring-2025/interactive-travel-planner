from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from app.schemas import CollaborationCreate, Collaboration
from app.crud import collaboration as crud_collaboration
from app.database import get_db

router = APIRouter()

@router.post("/collaborations/", response_model=Collaboration)
def add_collaborator(collab: CollaborationCreate, db: Session = Depends(get_db)):
    return crud_collaboration.create_collaboration(db=db, collab=collab)

@router.get("/collaborations/{trip_id}", response_model=list[Collaboration])
def get_collaborators(trip_id: int, db: Session = Depends(get_db)):
    return crud_collaboration.get_collaborations_by_trip(db=db, trip_id=trip_id)