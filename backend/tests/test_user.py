import pytest
from fastapi.testclient import TestClient
from app.main import app


def get_auth_token():

    client = TestClient(app)

    response = client.post(
        "/auth/login",
         data={"username": "testuser", "password": "testpassword"},
    )
