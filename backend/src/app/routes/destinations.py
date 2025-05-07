from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.ext.asyncio import AsyncSession
from app.core.database import get_async_session
from app.models.destinations import Destination
from app.schemas.destinations import DestinationCreate, DestinationResponse
from sqlalchemy.future import select

router = APIRouter(prefix="/trips/{trip_id}/destinations", tags=["Destinations"])

@router.post("/", response_model=DestinationResponse)
async def add_destination(trip_id: int, dest: DestinationCreate, db: AsyncSession = Depends(get_async_session)):
    db_dest = Destination(**dest.dict(), trip_id=trip_id)
    db.add(db_dest)
    await db.commit()
    await db.refresh(db_dest)
    return db_dest

@router.get("/", response_model=list[DestinationResponse])
async def get_destinations(trip_id: int, db: AsyncSession = Depends(get_async_session)):
    result = await db.execute(select(Destination).where(Destination.trip_id == trip_id))
    return result.scalars().all()
