import pytest
from fastapi.testclient import TestClient
from app.main import app # adjust path to FastAPI

client = TestClient(app)

def get_auth_token():

    # Send login request to get token
    response = client.post(
        "/auth/login",
         data={"username": "testuser", "password": "testpassword"},
    )
