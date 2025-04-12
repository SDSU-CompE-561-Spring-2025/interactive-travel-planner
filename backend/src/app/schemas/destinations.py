from pydantic import BaseModel
from enum import Enum
from datetime import datetime

class DestinationBase(BaseModel):
    name: str
    location: str

class DestinationCreate(DestinationBase):
    pass

class DestinationResponse(DestinationBase):
    id: int
    trip_id: int

    class Config:
        orm_mode = True
