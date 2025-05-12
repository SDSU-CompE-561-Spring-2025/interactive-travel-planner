from app.models.itineraries import Itinerary as ItineraryModel
from app.schemas.itineraries import ItineraryUpdate

def update_itinerary(db, itinerary_id: int, itin_data: ItineraryUpdate):
    payload = itin_data.dict(exclude_unset=True)
    return ItineraryModel.update_itinerary(db, itinerary_id, payload)
