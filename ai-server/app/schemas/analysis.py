from pydantic import BaseModel, field_validator
from typing import List, Optional, Union, Any
from uuid import UUID
from datetime import date
from app.schemas.ocr import LineItem

class AnalysisResult(BaseModel):
    category: str
    confidence: float
    description: Optional[str] = None
    tags: List[str] = []
    merchant_name: Optional[str] = None
    amount: Optional[float] = None
    date: Optional[Any] = None
    currency: Optional[str] = "INR"
    type: Optional[str] = "RECEIPT"  # RECEIPT, BILL, OTHER
    line_items: List[LineItem] = []

    @field_validator("date", mode="before")
    @classmethod
    def serialize_date(cls, v: Any) -> Any:
        if isinstance(v, date):
            return v.isoformat()
        return v

class AnalysisResponse(BaseModel):
    filename: str
    analysis: AnalysisResult
    file_id: Optional[UUID] = None
