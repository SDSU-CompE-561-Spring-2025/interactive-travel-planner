from pydantic import BaseModel
from datetime import datetime
from typing import List, Optional
from .itineraries import Location  # Import Location schema


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

# Add Trip response schema with destinations
class Trip(TripBase):
    id: int
    user_id: int
    start_date: datetime
    end_date: datetime
    itineraries: List[int]
    destinations: List[Location]  # This will be populated in the router

    class Config:
        orm_mode = True
