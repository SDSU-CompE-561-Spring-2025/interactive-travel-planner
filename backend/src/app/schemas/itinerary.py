from pydantic import BaseModel
from datetime import datetime

class ItineraryBase(BaseModel):
    name: str
    time: datetime
    description: str | None = None
    location: str | None = None

class ItineraryCreate(ItineraryBase):
    pass

class ItineraryRead(ItineraryBase):
    id: int
    trip_id: int

    model_config = {"from_attributes": True}
