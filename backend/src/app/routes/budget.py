from fastapi import APIRouter, Depends, HTTPException, status
from app.dependencies import get_db
from fastapi import Depends
from sqlalchemy.orm import Session
from uuid import UUID
from app.schemas.budget import BudgetOut
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

from app.schemas.budget import BudgetCreate

@router.post("/trips/{trip_id}/budget", response_model=BudgetOut)
async def create_trip_budget(trip_id: UUID, budget_data: BudgetCreate, db: Session = Depends(get_db)):
    new_budget = Budget(**budget_data.dict(), trip_id=trip_id)
    db.add(new_budget)
    db.commit()
    db.refresh(new_budget)
    return new_budget
 
from app.schemas.budget import BudgetUpdate

@router.put("/budget/{budget_id}", response_model=BudgetOut)
async def update_budget(budget_id: UUID, budget_data: BudgetUpdate, db: Session = Depends(get_db)):
    budget = db.query(Budget).filter(Budget.id == budget_id).first()
    if not budget:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Budget not found")
    
    for key, value in budget_data.dict(exclude_unset=True).items():
        setattr(budget, key, value)

    db.commit()
    db.refresh(budget)
    return budget

@router.delete("/budget/{budget_id}")
async def delete_budget(budget_id: UUID, db: Session = Depends(get_db)):
    budget = db.query(Budget).filter(Budget.id == budget_id).first()
    if not budget:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Budget not found")

    db.delete(budget)
    db.commit()
    return {"detail": "Budget deleted successfully"}
