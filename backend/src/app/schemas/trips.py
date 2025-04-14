
from pydantic import BaseModel
from enum import Enum
from datetime import datetime
from typing import Optional



class TripBase(BaseModel):
    title: Optional[str] = None
    description: Optional[str] = None
    start_date: datetime
    end_date: datetime

    class Config:
        orm_mode = True


class TripCreate(TripBase):
    pass

class Trip(TripBase):
    id: int
    user_id: int
    created_at: datetime
    updated_at: datetime

    class Config:
        orm_mode = True
