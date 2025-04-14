from pydantic import BaseModel
from datetime import datetime
from typing import Optional

class CalendarEventBase(BaseModel):
    title: str
    description: Optional[str] = None
    start_date: datetime
    end_date: datetime

class CalendarEventCreate(CalendarEventBase):
    pass

class CalendarEvent(CalendarEventBase):
    id: int
    user_id:int 

    class Config:
        orm_mode = True