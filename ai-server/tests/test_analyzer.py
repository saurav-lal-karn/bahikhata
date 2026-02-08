from fastapi.testclient import TestClient
from app.main import app
import uuid

client = TestClient(app)

def test_analyze_document_success():
    file_id = str(uuid.uuid4())
    file_url = f"http://localhost:3080/uploads/{file_id}_test.png"
    
    response = client.post(
        "/api/v1/analyzer/analyze",
        json={"file_id": file_id, "file_url": file_url}
    )
    
    assert response.status_code == 200
    data = response.json()
    assert data["success"] is True
    assert "analysis" in data["data"]
    assert "decoupled-flow" in data["data"]["analysis"]["tags"]
    assert data["data"]["filename"] == f"file_{file_id}"

def test_analyze_document_invalid_payload():
    response = client.post(
        "/api/v1/analyzer/analyze",
        json={"wrong_field": "data"}
    )
    
    # Fastapi returns 422 for validation errors by default
    assert response.status_code == 422
