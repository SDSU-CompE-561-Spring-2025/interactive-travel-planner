from fastapi import APIRouter, Depends
from sqlalchemy.ext.asyncio import AsyncSession
from app.core.database import get_async_session
from app.models.budget import Budget
from app.schemas.budget import BudgetCreate, BudgetResponse
from sqlalchemy.future import select

router = APIRouter(prefix="/trips/{trip_id}/budget", tags=["Budget"])

@router.post("/", response_model=BudgetResponse)
async def add_budget(trip_id: int, item: BudgetCreate, db: AsyncSession = Depends(get_async_session)):
    db_item = Budget(**item.dict(), trip_id=trip_id)
    db.add(db_item)
    await db.commit()
    await db.refresh(db_item)
    return db_item

@router.get("/", response_model=list[BudgetResponse])
async def get_budgets(trip_id: int, db: AsyncSession = Depends(get_async_session)):
    result = await db.execute(select(Budget).where(Budget.trip_id == trip_id))
    return result.scalars().all()
