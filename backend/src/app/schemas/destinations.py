from pydantic import BaseModel
from enum import Enum
from datetime import datetime
from typing import Optional

class DestinationBase(BaseModel):
    destination: str
    descrilocationption: Optional[str] = None
    order: Optional[str] = None

class DestinationCreate(DestinationBase):
    pass

class DestinationResponse(DestinationBase):
    id: int
    trip_id: int
    created_at: datetime
    updated_at: datetime

    class Config:
        from_attributes = True
