from pydantic import BaseModel
from typing import Optional, List, Dict
from datetime import datetime

class Coordinates(BaseModel):
    lat: float
    lng: float

class LocationBase(BaseModel):
    name: str
    coordinates: Coordinates
    date: Optional[datetime] = None
    start_date: Optional[datetime] = None
    end_date: Optional[datetime] = None
    color: Optional[str] = None
    comments: Optional[str] = None

class LocationCreate(LocationBase):
    trip_id: Optional[int] = None

class Location(LocationBase):
    id: int
    itinerary_id: int

    class Config:
        orm_mode = True

class TransportationBase(BaseModel):
    type: str
    from_location: str
    to_location: str
    departure_date: datetime
    departure_time: str
    arrival_date: datetime
    arrival_time: str
    provider: str

class TransportationCreate(TransportationBase):
    pass

class Transportation(TransportationBase):
    id: int
    itinerary_id: int

    class Config:
        orm_mode = True

class ActivityBase(BaseModel):
    name: str
    date: datetime
    time: str
    duration: str
    location: str
    notes: Optional[str] = None
    category: str
    coordinates: Optional[Coordinates] = None
    location_id: int

class ActivityCreate(ActivityBase):
    pass

class Activity(ActivityBase):
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
    transportation: Optional[List[TransportationCreate]] = []
    activities: Optional[List[ActivityCreate]] = []

class ItineraryUpdate(BaseModel):
    name: Optional[str]
    description: Optional[str]
    start_date: Optional[datetime]
    end_date: Optional[datetime]
    trips: Optional[List[int]]
    locations: Optional[List[LocationCreate]]
    transportation: Optional[List[TransportationCreate]]
    activities: Optional[List[ActivityCreate]]

    class Config:
        orm_mode = True

class Itinerary(ItineraryBase):
    id: int
    user_id: int
    trips: List[int]
    locations: List[Location]
    transportation: List[Transportation]
    activities: List[Activity]

    class Config:
        orm_mode = True
