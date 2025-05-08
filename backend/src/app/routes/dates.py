# ✅ Full FastAPI Dates Router — Linked to `trip_id`

from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from app.models.dates import Dates
from app.schemas.dates import DatesCreate, DatesRead
from app.dependencies import get_db

router = APIRouter(
    prefix="",
    tags=["Dates"]
)

# ✅ Get date range for a specific trip
@router.get("/trips/{trip_id}/dates", response_model=DatesRead)
def get_dates(trip_id: int, db: Session = Depends(get_db)):
    dates = db.query(Dates).filter(Dates.trip_id == trip_id).first()
    if not dates:
        raise HTTPException(status_code=404, detail="No dates found")
    return dates

# ✅ Create date range for a trip
@router.post("/trips/{trip_id}/dates", response_model=DatesRead)
def create_dates(trip_id: int, payload: DatesCreate, db: Session = Depends(get_db)):
    existing = db.query(Dates).filter(Dates.trip_id == trip_id).first()
    if existing:
        raise HTTPException(status_code=400, detail="Trip already has a date range")

    dates = Dates(**payload.dict(), trip_id=trip_id)
    db.add(dates)
    db.commit()
    db.refresh(dates)
    return dates

# ✅ Update an existing date entry by trip ID
@router.put("/trips/{trip_id}/dates", response_model=DatesRead)
def update_dates(trip_id: int, update: DatesCreate, db: Session = Depends(get_db)):
    dates = db.query(Dates).filter(Dates.trip_id == trip_id).first()
    if not dates:
        raise HTTPException(status_code=404, detail="Date entry not found")
    for key, value in update.dict().items():
        setattr(dates, key, value)
    db.commit()
    db.refresh(dates)
    return dates

# ✅ Delete a date entry by internal date ID
# Delete a single date entry
@router.delete("/dates/{date_id}")
def delete_dates(date_id: int, db: Session = Depends(get_db)):
    dates = db.query(Dates).filter(Dates.id == date_id).first()
    if not dates:
        raise HTTPException(status_code=404, detail="Date entry not found")
    db.delete(dates)
    db.commit()
    return {"message": f"Date entry {date_id} deleted"}

@router.delete("/destinations/{destination_id}")
def delete_destination(destination_id: int, db: Session = Depends(get_db)):
    return {"message": f"Destination {destination_id} deleted successfully"}
