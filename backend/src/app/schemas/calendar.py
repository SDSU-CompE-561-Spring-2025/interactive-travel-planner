from pydantic import BaseModel
from datetime import date

class CalendarBase(BaseModel):
    start_date: date
    end_date: date