fromfrom fastapi import APIRouter
from app.dependencies import get_db
from fastapi import Depends
from sqlalchemy.orm import Session
from app.schemas.budget import 
from app.models.budget import Budget

router = APIRouter()

# Retrieve budget based off of trip_id
@router.get("/trips/{tripId}/budget", )
async def get_trip_budget():
    budget = db.query(Budget).filter(Budget.trip_id == trip_id).all()
    
    if not Budget:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"No budget found for trip {trip_id}"
        )

    return Budget

@router.post("/trips/{tripId}/budget", )
async def create_trip_budget():

@router.put("/budget/{budgetId}", )
async def update_budget():

@router.delete("budget/{budgetId}", )
async def delete_budget():