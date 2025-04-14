import pytest
from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker
from app.models import destinations as models
from app.schemas.destinations import DestinationCreate
from app.database import Base
from app.services import destinations as service  # assuming you saved your functions in services/destinations.py

# Create in-memory SQLite DB
SQLALCHEMY_DATABASE_URL = "sqlite:///:memory:"
engine = create_engine(SQLALCHEMY_DATABASE_URL, connect_args={"check_same_thread": False})
TestingSessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)


@pytest.fixture(scope="module")
def db():
    # Create tables
    Base.metadata.create_all(bind=engine)
    db = TestingSessionLocal()
    yield db
    db.close()
    Base.metadata.drop_all(bind=engine)


@pytest.fixture
def sample_trip(db):
    trip = models.Trip(name="Sample Trip")
    db.add(trip)
    db.commit()
    db.refresh(trip)
    return trip


def test_create_trip_destination(db, sample_trip):
    data = DestinationCreate(name="Paris", description="City of Light")
    destination = service.create_trip_destination(sample_trip.id, data, db)

    assert destination.id is not None
    assert destination.name == "Paris"
    assert destination.trip_id == sample_trip.id


def test_get_destinations_by_trip(db, sample_trip):
    destinations = service.get_destinations_by_trip(sample_trip.id, db)
    assert len(destinations) == 1
    assert destinations[0].name == "Paris"


def test_get_destination(db, sample_trip):
    destination = service.get_destinations_by_trip(sample_trip.id, db)[0]
    found = service.get_destination(destination.id, db)

    assert found is not None
    assert found.name == "Paris"


def test_update_destination(db, sample_trip):
    destination = service.get_destinations_by_trip(sample_trip.id, db)[0]
    update_data = DestinationCreate(name="Rome", description="City of Seven Hills")
    updated = service.update_destination(destination.id, update_data, db)

    assert updated.name == "Rome"
    assert updated.description == "City of Seven Hills"


def test_delete_destination(db, sample_trip):
    destination = service.get_destinations_by_trip(sample_trip.id, db)[0]
    deleted = service.delete_destination(destination.id, db)

    assert deleted is not None
    assert service.get_destination(destination.id, db) is None