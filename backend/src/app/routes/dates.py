from fastapi import APIRouter, Depends
from sqlalchemy.ext.asyncio import AsyncSession
from app.core.database import get_async_session
from app.models.dates import Date
from app.schemas.dates import DateCreate, DateResponse
from sqlalchemy.future import select

router = APIRouter(prefix="/trips/{trip_id}/dates", tags=["Dates"])

@router.post("/", response_model=DateResponse)
async def add_date(trip_id: int, date: DateCreate, db: AsyncSession = Depends(get_async_session)):
    db_date = Date(**date.dict(), trip_id=trip_id)
    db.add(db_date)
    await db.commit()
    await db.refresh(db_date)
    return db_date

@router.get("/", response_model=list[DateResponse])
async def get_dates(trip_id: int, db: AsyncSession = Depends(get_async_session)):
    result = await db.execute(select(Date).where(Date.trip_id == trip_id))
    return result.scalars().all()
