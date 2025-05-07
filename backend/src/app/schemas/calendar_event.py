from pydantic import BaseModel
from datetime import datetime

class CalendarEventBase(BaseModel):
    title: str
    description: str
    start_time: datetime
    end_time: datetime

class CalendarEventCreate(CalendarEventBase):
    pass

class CalendarEventResponse(CalendarEventBase):
    id: int
    class Config:
        orm_mode = True
