from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.ext.asyncio import AsyncSession
from app.core.database import get_async_session
from app.models.trips import Trip
from app.schemas.trips import TripCreate, TripResponse
from sqlalchemy.future import select

router = APIRouter(prefix="/trips", tags=["Trips"])

@router.post("/", response_model=TripResponse)
async def create_trip(trip: TripCreate, db: AsyncSession = Depends(get_async_session)):
    db_trip = Trip(**trip.dict())
    db.add(db_trip)
    await db.commit()
    await db.refresh(db_trip)
    return db_trip

@router.get("/{trip_id}", response_model=TripResponse)
async def get_trip(trip_id: int, db: AsyncSession = Depends(get_async_session)):
    result = await db.execute(select(Trip).where(Trip.id == trip_id))
    trip = result.scalar_one_or_none()
    if trip is None:
        raise HTTPException(status_code=404, detail="Trip not found")
    return trip
