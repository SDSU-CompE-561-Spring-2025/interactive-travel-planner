import pytest
from app.schemas.destinations import DestinationCreate

def test_create_destination_schema_valid():
    destination = DestinationCreate(
        name="Paris",
        description="City of Light",
        location="France"
    )

    assert destination.name == "Paris"
    assert destination.description == "City of Light"
    assert destination.location == "France"

def test_create_destination_missing_name():
    with pytest.raises(ValueError):
        DestinationCreate(
            description="Missing name",
            location="Nowhere"
        )

def test_create_destination_missing_description():
    destination = DestinationCreate(
        name="Rome",
        location="Italy"
    )

    assert destination.name == "Rome"
    assert destination.location == "Italy"
    assert destination.description is None
