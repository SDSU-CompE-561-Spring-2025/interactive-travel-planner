from pydantic import BaseModel
from datetime import date

class DateBase(BaseModel):
    date: date

class DateCreate(DateBase):
    pass

class DateResponse(DateBase):
    id: int
    class Config:
        orm_mode = True
