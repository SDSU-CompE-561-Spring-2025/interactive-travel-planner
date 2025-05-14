from pydantic import BaseModel
from datetime import datetime
from typing import List, Optional


class CollaboratorInfo(BaseModel):
    id: int
    username: str

class TripBase(BaseModel):
    name: str
    description: Optional[str] = None
    location: Optional[str] = None
    budget: Optional[float] = None
    color: Optional[str] = None

class TripCreate(TripBase):
    itineraries: List[int] = []
    start_date: datetime
    end_date: datetime
    location: str
    color: Optional[str] = None

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

class TripOut(TripBase):
    id: int
    start_date: datetime
    end_date: datetime
    collaborators: List[CollaboratorInfo] = []
    class Config:
        orm_mode = True
