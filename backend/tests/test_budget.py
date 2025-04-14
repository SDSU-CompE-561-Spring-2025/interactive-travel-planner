import pytest
from fastapi.testclient import TestClient
from app.main import app

client = TestClient(app)

# Sample test trip and budget payloads
trip_id = 1

sample_budget = {
    "amount": 500.0,
    "currency": "USD",
    "description": "Flight",
    "category": "Travel"
}

updated_budget = {
    "amount": 750.0,
    "currency": "USD",
    "description": "Updated Flight",
    "category": "Travel"
}


def test_create_budget():
    response = client.post(f"/trips/{trip_id}/budget", json=sample_budget)
    assert response.status_code == 200
    data = response.json()
    assert data["amount"] == sample_budget["amount"]
    assert data["currency"] == sample_budget["currency"]
    assert "id" in data
    global created_budget_id
    created_budget_id = data["id"]


def test_get_budget_list():
    response = client.get(f"/trips/{trip_id}/budget")
    assert response.status_code == 200
    data = response.json()
    assert isinstance(data, list)
    assert any(b["description"] == "Flight" for b in data)


def test_update_budget():
    response = client.put(f"/budget/{created_budget_id}", json=updated_budget)
    assert response.status_code == 200
    data = response.json()
    assert data["amount"] == updated_budget["amount"]
    assert data["description"] == updated_budget["description"]


def test_delete_budget():
    response = client.delete(f"/budget/{created_budget_id}")
    assert response.status_code == 200
    assert response.json()["detail"] == "Budget deleted successfully"
