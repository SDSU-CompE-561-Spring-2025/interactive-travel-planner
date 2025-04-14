import pytest
from fastapi.testclient import TestClient
from app.main import app

# Get token from /auth/login
@pytest.fixture
def get_auth_token():
    client = TestClient(app)

    response = client.post(
        "/auth/login",
        data={"username": "testuser", "password": "testpassword"},
        headers={"Content-Type": "application/x-www-form-urlencoded"}
    )

    assert response.status_code == 200
    token = response.json()["access_token"]
    return f"Bearer {token}"

# Main calendar test
def test_create_calendar_event(get_auth_token):
    from app.main import app  # Lazy import again
    client = TestClient(app)

    headers = {
        "Authorization": get_auth_token
    }

    payload = {
        "title": "Test Event",
        "description": "Testing calendar creation",
        "start_date": "2025-06-01T10:00:00",
        "end_date": "2025-06-01T12:00:00"
    }

    response = client.post("/calendar/events/", json=payload, headers=headers)
    assert response.status_code == 200, response.text

    data = response.json()
    assert data["title"] == "Test Event"
    assert data["description"] == "Testing calendar creation"
