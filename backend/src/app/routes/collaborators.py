from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.ext.asyncio import AsyncSession
from app.core.database import get_async_session
from app.models.trips import Trip
from app.models.user import User
from app.schemas.user import UserOut
from sqlalchemy.future import select

router = APIRouter(prefix="/trips/{trip_id}/collaborators", tags=["Collaborators"])

@router.post("/{user_id}", response_model=UserOut)
async def add_collaborator(trip_id: int, user_id: int, db: AsyncSession = Depends(get_async_session)):
    trip = await db.get(Trip, trip_id)
    user = await db.get(User, user_id)
    if not trip or not user:
        raise HTTPException(status_code=404, detail="Trip or user not found")
    trip.collaborators.append(user)
    await db.commit()
    return user

@router.get("/", response_model=list[UserOut])
async def get_collaborators(trip_id: int, db: AsyncSession = Depends(get_async_session)):
    trip = await db.get(Trip, trip_id)
    if not trip:
        raise HTTPException(status_code=404, detail="Trip not found")
    return trip.collaborators
