from pydantic import BaseModel
from typing import Optional


class ItineraryBase(BaseModel):
    name: str
    description: Optional[str] = None

class ItineraryCreate(ItineraryBase):
    pass
