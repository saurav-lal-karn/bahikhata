from fastapi import APIRouter, HTTPException, Body
import random
from pydantic import BaseModel, HttpUrl
from uuid import UUID
from app.schemas.common import ResponseBase
from app.schemas.analysis import AnalysisResponse, AnalysisResult

router = APIRouter()

class AnalyzeRequest(BaseModel):
    file_id: UUID
    file_url: str
    user_id: UUID
    family_id: UUID

CATEGORIES = [
    "Groceries",
    "Dining Out",
    "Transportation",
    "Utilities",
    "Entertainment",
    "Healthcare",
    "Shopping",
    "Travel",
    "Insurance",
    "Investments"
]

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
        
        # 4. Run OCR and Extraction
        ocr_result = await ocr_service.process_receipt(file_contents, filename=f"file_{request.file_id}")
        
        # 5. Map OCR results to AnalysisResult
        # Note: ocr_service already returns ReceiptData which we can use
        analysis = AnalysisResult(
            category=ocr_result.extracted_data.category or "Uncategorized",
            confidence=ocr_result.confidence_score,
            description=f"AI extracted details for merchant: {ocr_result.extracted_data.merchant_name}",
            tags=["ai-extracted"],
            merchant_name=ocr_result.extracted_data.merchant_name,
            amount=ocr_result.extracted_data.total_amount,
            date=ocr_result.extracted_data.transaction_date,
            currency=ocr_result.extracted_data.currency or "INR",
            type="RECEIPT", # Logic could be added to detect BILL vs RECEIPT
            line_items=ocr_result.extracted_data.line_items
        )
        
        result = AnalysisResponse(
            filename=f"file_{request.file_id}",
            analysis=analysis,
            file_id=request.file_id
        )

        # 6. Notify completion
        await notification_service.send_notification(
            user_id=str(request.user_id),
            family_id=str(request.family_id),
            title="Analysis Complete",
            message=f"Document analyzed successfully! Merchant: {analysis.merchant_name}",
            n_type="TASK_COMPLETE"
        )
        
        return ResponseBase(data=result)
        
    except Exception as e:
        print(f"Analysis Error: {e}")
        # Notify Error
        await notification_service.send_notification(
            user_id=str(request.user_id),
            family_id=str(request.family_id),
            title="Analysis Failed",
            message=f"Error analyzing document: {str(e)}",
            n_type="TASK_ERROR"
        )
        raise HTTPException(status_code=500, detail=str(e))
