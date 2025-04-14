import pytest
from app.schemas.destinations import DestinationCreate

def test_create_destination_schema_valid():
    destination = DestinationCreate(
        name="Paris",
        description="City of Light"
    )

    assert destination.name == "Paris"
    assert destination.description == "City of Light"

def test_create_destination_missing_name():
    with pytest.raises(ValueError):
        DestinationCreate(
            description="Missing name"
        )

def test_create_destination_missing_description():
    with pytest.raises(ValueError):
        DestinationCreate(
            name="Rome"
        )
