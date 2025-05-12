from ..models.itineraries import Itinerary as ItineraryModel
from ..schemas.itineraries import ItineraryUpdate
from fastapi import HTTPException, status

def update_itinerary(db, itinerary_id: int, itin_data: ItineraryUpdate):
    payload = itin_data.dict(exclude_unset=True)
    return ItineraryModel.update_itinerary(db, itinerary_id, payload)
