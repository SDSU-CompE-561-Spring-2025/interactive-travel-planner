import pytest
from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker
from datetime import datetime, timedelta

from fastapi.testclient import TestClient
from app.main import app
from app.core.database import Base
from app.dependencies import get_db
from app.models.user import User

SQLALCHEMY_DATABASE_URL = "sqlite:///./test.db"
engine = create_engine(SQLALCHEMY_DATABASE_URL, connect_args={"check_same_thread": False})
TestingSessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)

Base.metadata.create_all(bind=engine)

def override_get_db():
    try:
        db = TestingSessionLocal()
        yield db
    finally:
        db.close()

app.dependency_overrides[get_db] = override_get_db

@pytest.fixture
def client():
    with TestClient(app) as c:
        yield c

@pytest.fixture
def test_user():
    db = TestingSessionLocal()
    user = User(email="test@example.com", hashed_password="hashedpassword")
    db.add(user)
    db.commit()
    db.refresh(user)
    db.close()
    return user

def test_create_trip(client, test_user):
    trip_data = {
        "title": "Trip to the Desert",
        "description": "Exploring the Colorado Desert",
        "start_date": datetime.now().isoformat(),
        "end_date": (datetime.now() + timedelta(days=3)).isoformat()
    }
    response = client.post(f"/users/{test_user.id}/trips", json=trip_data)
    assert response.status_code == 200
    assert response.json()["title"] == "Trip to the Desert"

def test_get_user_trips(client, test_user):
    response = client.get(f"/users/{test_user.id}/trips")
    assert response.status_code == 200
    assert isinstance(response.json(), list)

def test_update_trip(client, test_user):
    trip_data = {
        "title": "Trip to Mountains",
        "description": "Climbing",
        "start_date": datetime.now().isoformat(),
        "end_date": (datetime.now() + timedelta(days=2)).isoformat()
    }
    create_resp = client.post(f"/users/{test_user.id}/trips", json=trip_data)
    trip_id = create_resp.json()["id"]

    updated_data = {
        "title": "Trip to Hills",
        "description": "Hiking",
        "start_date": datetime.now().isoformat(),
        "end_date": (datetime.now() + timedelta(days=4)).isoformat()
    }
    response = client.put(f"/trips/{trip_id}", json=updated_data)
    assert response.status_code == 200
    assert response.json()["title"] == "Trip to Hills"

def test_get_trip_by_id(client, test_user):
    trip_data = {
        "title": "Trip for Testing",
        "description": "Test Desc",
        "start_date": datetime.now().isoformat(),
        "end_date": (datetime.now() + timedelta(days=1)).isoformat()
    }
    create_resp = client.post(f"/users/{test_user.id}/trips", json=trip_data)
    trip_id = create_resp.json()["id"]

    response = client.get(f"/trips/{trip_id}")
    assert response.status_code == 200
    assert response.json()["id"] == trip_id

def test_delete_trip(client, test_user):
    trip_data = {
        "title": "Trip to Delete",
        "description": "To be deleted",
        "start_date": datetime.now().isoformat(),
        "end_date": (datetime.now() + timedelta(days=1)).isoformat()
    }
    create_resp = client.post(f"/users/{test_user.id}/trips", json=trip_data)
    trip_id = create_resp.json()["id"]

    response = client.delete(f"/trips/{trip_id}")
    assert response.status_code == 200
    assert "deleted successfully" in response.json()["message"]
