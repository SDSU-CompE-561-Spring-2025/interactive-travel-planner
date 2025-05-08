from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from app.models.dates import Dates
from app.schemas.dates import DatesCreate, DatesRead
from app.dependencies import get_db

# Router for date-related endpoints
router = APIRouter(
    prefix="",
    tags=["Dates"]
)

# Get date range for a specific destination
@router.get("/destinations/{destination_id}/dates", response_model=DatesRead)
def get_dates(destination_id: int, db: Session = Depends(get_db)):
    dates = db.query(Dates).filter(Dates.trip_id == destination_id).first()
    if not dates:
        raise HTTPException(status_code=404, detail="No dates found")
    return dates

# Create date range for a destination
@router.post("/destinations/{destination_id}/dates", response_model=DatesRead)
def create_dates(destination_id: int, payload: DatesCreate, db: Session = Depends(get_db)):
    dates = Dates(**payload.dict(), trip_id=destination_id)
    db.add(dates)
    db.commit()
    db.refresh(dates)
    return dates

# Update an existing date entry
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

# Delete a single date entry
@router.delete("/dates/{date_id}")
def delete_dates(date_id: int, db: Session = Depends(get_db)):
    dates = db.query(Dates).filter(Dates.id == date_id).first()
    if not dates:
        raise HTTPException(status_code=404, detail="Not found")
    db.delete(dates)
    db.commit()
    return {"message": f"Date entry {date_id} deleted"}

@router.delete("/destinations/{destination_id}/dates")
def delete_all_dates(destination_id: int, db: Session = Depends(get_db)):
    entries = db.query(Dates).filter(Dates.trip_id == destination_id).all()
    if not entries:
        raise HTTPException(status_code=404, detail="No dates to delete")
    for entry in entries:
        db.delete(entry)
    db.commit()
    return {"message": f"All dates for destination {destination_id} deleted"}
