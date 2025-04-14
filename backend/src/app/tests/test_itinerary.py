import pytest
from datetime import datetime
from app.schemas.itinerary import ItineraryCreate

def test_create_itinerary_schema():
    itinerary = ItineraryCreate(
        name="Arrive in Tokyo",
        time=datetime(2025, 6, 1, 10, 0),
        description="Check into hotel",
        location="Tokyo",
    )

    assert itinerary.name == "Arrive in Tokyo"
    assert itinerary.time == datetime(2025, 6, 1, 10, 0)
    assert itinerary.description == "Check into hotel"
    assert itinerary.location == "Tokyo"

def test_itinerary_missing_field():
    with pytest.raises(ValueError):
        ItineraryCreate(
            # Missing name and time, which are required
            description="Only description"
        )
