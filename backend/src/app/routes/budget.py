fromfrom fastapi import APIRouter
from app.dependencies import get_db
from fastapi import Depends
from sqlalchemy.orm import Session
from app.schemas.budget import 
from app.models.budget import Budget

router = APIRouter()

@router.get("/trips/{tripId}/budget", )
async def get_trip_budget():

@router.post("/trips/{tripId}/budget", )
async def create_trip_budget():

@router.put("/budget/{budgetId}", )
async def update_budget():

@router.delete("budget/{budgetId}", )
async def delete_budget():