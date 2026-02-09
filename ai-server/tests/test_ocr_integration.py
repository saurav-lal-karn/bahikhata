import pytest
from app.services.vector_db_service import vector_db_service
from app.services.ocr_service import ocr_service
import os
import shutil
from unittest.mock import MagicMock, patch

# Test ChromaDB integration
def test_vector_db_add_and_query():
    doc_id = "test_doc_1"
    text = "Sample receipt content"
    metadata = {"test": "true"}
    
    vector_db_service.add_document(doc_id, text, metadata)
    results = vector_db_service.query_document(text, n_results=1)
    
    assert doc_id in results['ids'][0]
    assert text in results['documents'][0]

@pytest.mark.asyncio
@patch("app.services.ocr_service.Groq")
@patch("pytesseract.image_to_string")
async def test_ocr_service_flow(mock_tesseract, mock_groq):
    # Mock Tesseract
    mock_tesseract.return_value = "Mocked Merchant\nTotal: 100"
    
    # Mock Groq
    mock_client = MagicMock()
    mock_groq.return_value = mock_client
    mock_response = MagicMock()
    mock_response.choices = [
        MagicMock(message=MagicMock(content='{"merchant_name": "Mocked Merchant", "total_amount": 100, "currency": "INR"}'))
    ]
    mock_client.chat.completions.create.return_value = mock_response
    
    # Re-init ocr_service to use mocked Groq
    from app.services.ocr_service import OCRService
    service = OCRService()
    
    # Test process_receipt
    response = await service.process_receipt(b"fake_image_bytes", "test.jpg")
    
    assert response.extracted_data.merchant_name == "Mocked Merchant"
    assert response.extracted_data.total_amount == 100
    assert response.confidence_score > 0
