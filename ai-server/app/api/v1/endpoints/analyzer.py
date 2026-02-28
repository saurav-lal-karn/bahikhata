from typing import Dict
from typing import Optional
from fastapi import APIRouter, HTTPException, Body
import random
from pydantic import BaseModel, HttpUrl
from uuid import UUID
from app.schemas.common import ResponseBase
from app.schemas.analysis import AnalysisResponse, AnalysisResult
from app.schemas.ocr import LineItem, ClassificationResult, OCRResponse

router = APIRouter()

class AnalyzeRequest(BaseModel):
    file_id: UUID
    file_url: str
    user_id: UUID
    family_id: UUID
    document_type: str

class OCRClassifyRequest(BaseModel):
    file_url: str

class ExtractionRequest(BaseModel):
    ocr_text: str
    transaction_type: str
    category: Optional[str] = None

class StoreDocumentRequest(BaseModel):
    file_id: UUID
    ocr_text: str
    metadata: Optional[Dict] = None

from app.services.notification import notification_service
import asyncio

@router.post("/analyze", response_model=ResponseBase[AnalysisResponse])
async def analyze_document(request: AnalyzeRequest = Body(...)):
    # 1. Notify analysis started
    await notification_service.send_notification(
        user_id=str(request.user_id),
        family_id=str(request.family_id),
        title="Document Analysis Started",
        message=f"Analyzing your document: {request.file_id}",
        n_type="TASK_PROGRESS"
    )

    try:
        # 2. Fetch file content from URL
        import httpx
        from app.services.ocr_service import ocr_service
        
        async with httpx.AsyncClient() as client:
            response = await client.get(request.file_url)
            if response.status_code != 200:
                raise HTTPException(status_code=400, detail=f"Failed to fetch file from {request.file_url}")
            file_contents = response.content

        # 3. Notify OCR progress
        await notification_service.send_notification(
            user_id=str(request.user_id),
            family_id=str(request.family_id),
            title="Running OCR",
            message="Extracting text from document...",
            n_type="TASK_PROGRESS"
        )
        
        # 4. Run OCR and Extraction with enhanced service
        ocr_result = await ocr_service.process_receipt(file_contents, filename=f"file_{request.file_id}", document_type=request.document_type)
        
        # 5. Map OCR results to AnalysisResult with field confidence
        field_confidence_dict = {}
        if ocr_result.field_confidence:
            # Convert FieldConfidence model to dict, excluding None values
            field_confidence_dict = {
                k: v for k, v in ocr_result.field_confidence.model_dump().items() 
                if v is not None
            }
        
        analysis = AnalysisResult(
            category=ocr_result.extracted_data.category or "Uncategorized",
            confidence=ocr_result.confidence_score,
            description=ocr_result.extracted_data.description or f"AI extracted details for merchant: {ocr_result.extracted_data.merchant_name}",
            tags=list(set(["ai-extracted"] + ocr_result.extracted_data.tags)),
            merchant_name=ocr_result.extracted_data.merchant_name,
            vendor=ocr_result.extracted_data.vendor,
            location=ocr_result.extracted_data.location,
            payment_method=ocr_result.extracted_data.payment_method,
            amount=ocr_result.extracted_data.total_amount,
            date=ocr_result.extracted_data.transaction_date,
            currency=ocr_result.extracted_data.currency or "INR",
            type=ocr_result.extracted_data.document_type or "RECEIPT",
            transaction_type=ocr_result.extracted_data.transaction_type or "EXPENSE",
            line_items=ocr_result.extracted_data.line_items,
            # Bill/Invoice specific fields
            bill_number=ocr_result.extracted_data.bill_number,
            due_date=ocr_result.extracted_data.due_date,
            invoice_number=ocr_result.extracted_data.invoice_number,
            document_type=ocr_result.extracted_data.document_type or "RECEIPT",
            # Field-level confidence
            field_confidence=field_confidence_dict
        )
        
        result = AnalysisResponse(
            filename=f"file_{request.file_id}",
            analysis=analysis,
            file_id=request.file_id
        )

        # 6. Notify completion with document type
        doc_type_label = ocr_result.extracted_data.document_type or "Document"
        await notification_service.send_notification(
            user_id=str(request.user_id),
            family_id=str(request.family_id),
            title="Analysis Complete",
            message=f"{doc_type_label} analyzed successfully! Merchant: {analysis.merchant_name}",
            n_type="TASK_COMPLETE"
        )
        
        return ResponseBase(data=result)
        
    except Exception as e:
        print(f"Analysis Error: {e}")
        import traceback
        traceback.print_exc()
        # Notify Error
        await notification_service.send_notification(
            user_id=str(request.user_id),
            family_id=str(request.family_id),
            title="Analysis Failed",
            message=f"Error analyzing document: {str(e)}",
            n_type="TASK_ERROR"
        )
        raise HTTPException(status_code=500, detail=str(e))

@router.post("/ocr-classify", response_model=ResponseBase[ClassificationResult])
async def ocr_classify(request: OCRClassifyRequest = Body(...)):
    """
    Endpoint for Step 1: OCR and Classification
    """
    import httpx
    from app.services.ocr_service import ocr_service
    
    async with httpx.AsyncClient() as client:
        response = await client.get(request.file_url)
        if response.status_code != 200:
            raise HTTPException(status_code=400, detail=f"Failed to fetch file from {request.file_url}")
        file_contents = response.content

    result = await ocr_service.extract_and_classify(file_contents)
    return ResponseBase(data=result)

@router.post("/extract-structured", response_model=ResponseBase[OCRResponse])
async def extract_structured(request: ExtractionRequest = Body(...)):
    """
    Endpoint for Step 2: Structured Extraction
    """
    from app.services.ocr_service import ocr_service
    result = await ocr_service.extract_structured_data(
        ocr_text=request.ocr_text,
        transaction_type=request.transaction_type,
        category=request.category
    )
    return ResponseBase(data=result)

@router.post("/store-document", response_model=ResponseBase[Dict])
async def store_document(request: StoreDocumentRequest = Body(...)):
    """
    Endpoint for Step 3: Store OCR text in persistent Vector DB
    """
    from app.services.vector_db_service import vector_db_service
    metadata = request.metadata or {}
    metadata["timestamp"] = datetime.now().isoformat()
    
    vector_db_service.add_document(
        doc_id=str(request.file_id),
        text=request.ocr_text,
        metadata=metadata
    )
    return ResponseBase(data={"status": "stored", "file_id": request.file_id})
