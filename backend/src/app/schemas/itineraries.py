from pydantic import BaseModel
from typing import Optional, List
from datetime import datetime


class ItineraryBase(BaseModel):
    name: str
    description: Optional[str] = None
    start_date: datetime
    end_date: datetime

class ItineraryCreate(ItineraryBase):
    trips: Optional[List[int]] = []

class ItineraryUpdate(BaseModel):
    name: Optional[str]
    description: Optional[str]
    start_date: Optional[datetime]
    end_date: Optional[datetime]
    trips: Optional[List[int]]

    class Config:
        orm_mode = True
