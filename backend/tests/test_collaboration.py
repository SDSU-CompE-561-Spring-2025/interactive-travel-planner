from fastapi.testclient import TestClient
from app.main import app

client = TestClient(app)

def test_create_collaboration():
    # Send POST request to /collaborations/ endpoint
    response = client.post("/api/collaborations/", json={
        "trip_id" 1,
        "user_id": 2,
        "role": "editor"
    })
    assert response.status_code == 200
    data = response.json()

    # Assert the response data matches the input
    assert data["trip_id"] == 1
    assert data["user_id"] == 2
    assert data["role"] == "editor"

def test_get_collaborations():
    response = client.get("/api/collaborations/1")
    assert response.status_code == 200
    assert isinstance(response.json(), list)
