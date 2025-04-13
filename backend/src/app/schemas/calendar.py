from pydantic import BaseModel
from datetime import date

class CalendarBase(BaseModel):
    start_date: date
    end_date: date

class CalendarCreate(CalendarBase):
    trip_id: init

class CalendarResponse(CalendarBase):
    id: init 

    class Config:
        orm_mode = True