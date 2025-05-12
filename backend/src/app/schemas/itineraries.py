from pydantic import BaseModel
from typing import Optional
from datetime import datetime


class ItineraryBase(BaseModel):
    name: str
    description: Optional[str] = None
    start_date: datetime
    end_date: datetime

class ItineraryCreate(ItineraryBase):
    pass
