from pydantic import BaseModel
from datetime import datetime
from typing import List, Optional


class TripBase(BaseModel):
    name: str
    description: Optional[str] = None
    image_url: Optional[str] = None
    color: Optional[str] = None
    latitude: Optional[float] = None
    longitude: Optional[float] = None

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
    image_url: Optional[str] = None
    color: Optional[str] = None
    latitude: Optional[float] = None
    longitude: Optional[float] = None

    class Config:
        orm_mode = True
