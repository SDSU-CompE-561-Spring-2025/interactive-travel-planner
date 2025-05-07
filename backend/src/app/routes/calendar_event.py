from fastapi import APIRouter, Depends
from sqlalchemy.ext.asyncio import AsyncSession
from app.core.database import get_async_session
from app.models.calendar_event import CalendarEvent
from app.schemas.calendar_event import CalendarEventCreate, CalendarEventResponse
from sqlalchemy.future import select

router = APIRouter(prefix="/trips/{trip_id}/events", tags=["Calendar Events"])

@router.post("/", response_model=CalendarEventResponse)
async def add_event(trip_id: int, event: CalendarEventCreate, db: AsyncSession = Depends(get_async_session)):
    db_event = CalendarEvent(**event.dict(), trip_id=trip_id)
    db.add(db_event)
    await db.commit()
    await db.refresh(db_event)
    return db_event

@router.get("/", response_model=list[CalendarEventResponse])
async def get_events(trip_id: int, db: AsyncSession = Depends(get_async_session)):
    result = await db.execute(select(CalendarEvent).where(CalendarEvent.trip_id == trip_id))
    return result.scalars().all()
