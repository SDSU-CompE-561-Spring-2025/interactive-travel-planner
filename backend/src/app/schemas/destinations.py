from pydantic import BaseModel
from enum import Enum
from datetime import datetime

class Destinations(BaseModel):
    id: int
    trip_id: int
    name: str
    description: str
    location: str
    order: int
    created_at: datetime
    updated_at: datetime

    class Config:
        orm_mode = True
