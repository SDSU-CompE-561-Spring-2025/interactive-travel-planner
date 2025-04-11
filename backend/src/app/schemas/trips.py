
from pydantic import BaseModel
from enum import Enum
from datetime import datetime
from typing import Optional


class TripBase(BaseModel):
    id: int
    user_id: int
    title: str
    description: str
    start_date: datetime
    end_date: datetime
    created_at: datetime
    updated_at: datetime

    class Config:
        orm_mode = True


class TripCreate(TripBase):
    pass

class Trip(TripBase):
    id: int
    user_id: int

    class Config:
        orm_mode = True
