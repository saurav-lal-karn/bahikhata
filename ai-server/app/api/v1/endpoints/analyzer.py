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
        message=f"Analyzing your document: file_{request.file_id}",
        n_type="TASK_PROGRESS"
    )

    # Mock file access logic
    print(f"Analyzing file with ID: {request.file_id} from URL: {request.file_url}")
    
    # Simulate processing time
    await asyncio.sleep(2)

    # 2. Notify progress
    await notification_service.send_notification(
        user_id=str(request.user_id),
        family_id=str(request.family_id),
        title="Analyzing Metadata",
        message="Extracting categories and confidence scores...",
        n_type="TASK_PROGRESS"
    )

    await asyncio.sleep(2)
    
    # Mock analysis logic
    category = random.choice(CATEGORIES)
    confidence = round(random.uniform(0.75, 0.99), 2)
    
    analysis = AnalysisResult(
        category=category,
        confidence=confidence,
        description=f"Automatically detected category: {category} for file {request.file_id}",
        tags=["ai-generated", "auto-detected", "decoupled-flow"]
    )
    
    result = AnalysisResponse(
        filename=f"file_{request.file_id}",
        analysis=analysis
    )

    # 3. Notify completion
    await notification_service.send_notification(
        user_id=str(request.user_id),
        family_id=str(request.family_id),
        title="Analysis Complete",
        message=f"Document analyzed successfully! Category: {category}",
        n_type="TASK_COMPLETE"
    )
    
    return ResponseBase(data=result)
