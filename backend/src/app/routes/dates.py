from fastapi import APIRouter, Depends, HTTPException

#do this later
#pls help this is so annoying
from sqlalchemy.orm import Session
from app.models.dates import Dates
from app.schemas.dates import DatesCreate, DatesRead
from app.dependencies import get_db

router = APIRouter(
    prefix="",
    tags=["Dates"]
)

@router.get("/destinations/{destination_id}/dates", response_model=DatesRead)
def get_dates(destination_id: int, db: Session = Depends(get_db)):
    dates = db.query(Dates).filter(Dates.trip_id == destination_id).first()
    if not dates:
        raise HTTPException(status_code=404, detail="No dates found")
    return dates


@router.post("/destinations/{destination_id}/dates", response_model=DatesRead)
def create_dates(destination_id: int, payload: DatesCreate, db: Session = Depends(get_db)):
    dates = Dates(**payload.dict(), trip_id=destination_id)
    db.add(dates)
    db.commit()
    db.refresh(dates)
    return dates


@router.put("/dates/{date_id}", response_model=DatesRead)
def update_dates(date_id: int, update: DatesCreate, db: Session = Depends(get_db)):
    dates = db.query(Dates).filter(Dates.id == date_id).first()
    if not dates:
        raise HTTPException(status_code=404, detail="Not found")
    for key, value in update.dict().items():
        setattr(dates, key, value)
    db.commit()
    db.refresh(dates)
    return dates


@router.delete("/dates/{date_id}")
def delete_dates(date_id: int, db: Session = Depends(get_db)):
    dates = db.query(Dates).filter(Dates.id == date_id).first()
    if not dates:
        raise HTTPException(status_code=404, detail="Not found")
    db.delete(dates)
    db.commit()
    return {"message": f"Date entry {date_id} deleted"}

@router.delete("/destinations/{destination_id}")
def delete_destination(destination_id: int, db: Session = Depends(get_db)):
    return {"message": f"Destination {destination_id} deleted successfully"}
