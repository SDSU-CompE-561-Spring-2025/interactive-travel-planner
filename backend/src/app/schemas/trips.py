from pydantic import BaseModel
from datetime import datetime
from typing import List, Optional


class TripBase(BaseModel):
    name: str
    description: Optional[str] = None

class TripCreate(TripBase):
    itineraries: List[int] = []
    start_date: datetime
    end_date: datetime

class TripUpdate(BaseModel):
    name: str
    description: Optional[str]
    start_date: datetime
    end_date: datetime
    itineraries: List[int]

    class Config:
        orm_mode = True
