from pydantic import BaseModel
from typing import List, Optional


class TripBase(BaseModel):
    name: str
    description: Optional[str] = None

class TripCreate(TripBase):
    itineraries: List[int] = []
