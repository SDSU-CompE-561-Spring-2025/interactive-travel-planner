from pydantic import BaseModel
from datetime import datetime
from typing import List, Optional


class TripBase(BaseModel):
    name: str
    description: Optional[str] = None
    location: Optional[str] = None
    budget: Optional[float] = None

class TripCreate(TripBase):
    itineraries: List[int] = []
    start_date: datetime
    end_date: datetime
    location: str

class TripUpdate(BaseModel):
    name: str
    description: Optional[str]
    location: Optional[str]
    budget: Optional[float]
    start_date: datetime
    end_date: datetime
    itineraries: List[int]

    class Config:
        orm_mode = True
