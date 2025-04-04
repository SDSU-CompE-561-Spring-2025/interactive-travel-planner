
from pydantic import BaseModel
from enum import Enum
from datetime import datetime

class Trips(BaseModel):
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


# add tripcreate and tripupdate schemas here
