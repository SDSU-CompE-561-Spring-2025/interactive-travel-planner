from pydantic import BaseModel
from typing import Optional, List, Tuple
from datetime import datetime


class LocationBase(BaseModel):
    name: str
    coordinates: Tuple[float, float]
    description: Optional[str] = None


class LocationCreate(LocationBase):
    pass


class LocationResponse(LocationBase):
    id: int
    itinerary_id: int

    class Config:
        orm_mode = True


class ItineraryBase(BaseModel):
    name: str
    description: Optional[str] = None
    start_date: datetime
    end_date: datetime


class ItineraryCreate(ItineraryBase):
    trips: Optional[List[int]] = []
    locations: Optional[List[LocationCreate]] = []


class ItineraryUpdate(BaseModel):
    name: Optional[str]
    description: Optional[str]
    start_date: Optional[datetime]
    end_date: Optional[datetime]
    trips: Optional[List[int]]
    locations: Optional[List[LocationCreate]]

    class Config:
        orm_mode = True


class ItineraryResponse(ItineraryBase):
    id: int
    user_id: int
    locations: List[LocationResponse]

    class Config:
        orm_mode = True
