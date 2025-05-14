from pydantic import BaseModel, computed_field
from typing import Optional, List, Tuple
from datetime import datetime


class LocationBase(BaseModel):
    name: str
    description: Optional[str] = None


class LocationCreate(BaseModel):
    name: str
    description: Optional[str] = None
    coordinates: Tuple[float, float]


class LocationResponse(BaseModel):
    id: int
    itinerary_id: int
    name: str
    description: Optional[str] = None
    latitude: float
    longitude: float

    @computed_field
    @property
    def coordinates(self) -> Tuple[float, float]:
        return (self.latitude, self.longitude)

    model_config = {
        "from_attributes": True,
        "json_schema_extra": {
            "examples": [
                {
                    "id": 1,
                    "itinerary_id": 1,
                    "name": "Example Location",
                    "description": "A description",
                    "latitude": 40.7128,
                    "longitude": -74.0060
                }
            ]
        }
    }


class ItineraryBase(BaseModel):
    name: str
    description: Optional[str] = None
    start_date: datetime
    end_date: datetime


class ItineraryCreate(ItineraryBase):
    trips: Optional[List[int]] = []
    locations: Optional[List[LocationCreate]] = []


class ItineraryUpdate(BaseModel):
    name: Optional[str]
    description: Optional[str]
    start_date: Optional[datetime]
    end_date: Optional[datetime]
    trips: Optional[List[int]]
    locations: Optional[List[LocationCreate]]

    model_config = {
        "from_attributes": True
    }


class ItineraryResponse(ItineraryBase):
    id: int
    user_id: int
    locations: List[LocationResponse]

    model_config = {
        "from_attributes": True
    }
