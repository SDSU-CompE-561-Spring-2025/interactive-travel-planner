from pydantic import BaseModel
from datetime import datetime
from typing import List
from .destinations import DestinationResponse
from .budget import BudgetResponse
from .calendar_event import CalendarEventResponse
from .dates import DateResponse

class TripBase(BaseModel):
    title: str
    description: str

class TripCreate(TripBase):
    start_date: datetime
    end_date: datetime

class TripResponse(TripBase):
    id: int
    start_date: datetime
    end_date: datetime
    created_at: datetime
    updated_at: datetime
    destinations: List[DestinationResponse] = []
    budgets: List[BudgetResponse] = []
    calendar_events: List[CalendarEventResponse] = []
    dates: List[DateResponse] = []

    class Config:
        orm_mode = True
