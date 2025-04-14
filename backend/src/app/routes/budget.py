from fastapi import APIRouter, Depends, HTTPException, status
from app.dependencies import get_db
from fastapi import Depends
from sqlalchemy.orm import Session
from app.schemas.budget import 
from app.models.budget import Budget

router = APIRouter()

# Retrieve budget based off of trip_id
@router.get("/trips/{trip_Id}/budget", )
async def get_trip_budget(trip_id: int, db: Session = Depends(get_db)):
    budget = db.query(Budget).filter(Budget.trip_id == trip_id).all()
    
    if not budget:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"No budget found for trip {trip_id}"
        )

    return budget

@router.post("/trips/{trip_Id}/budget", )
async def create_trip_budget():
    
@router.put("/budget/{budget_Id}", )
async def update_budget():

@router.delete("budget/{budget_Id}", )
async def delete_budget():