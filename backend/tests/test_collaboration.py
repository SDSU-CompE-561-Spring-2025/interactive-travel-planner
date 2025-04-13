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