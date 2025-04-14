from pydantic import BaseModel
from datetime import datetime

# Base schema shared across create and read
class ItineraryBase(BaseModel):
    name: str
    time: datetime
    description: str | None = None
    location: str | None = None

# Schema for creating an itinerary (same fields as base)
class ItineraryCreate(ItineraryBase):
    pass

# Schema for reading an itinerary (includes ID and trip ID)
class ItineraryRead(ItineraryBase):
    id: int
    trip_id: int

    model_config = {"from_attributes": True}  # allows ORM-style parsing
