from pydantic import BaseModel, field_validator
from typing import List, Optional, Union, Any, Dict
from uuid import UUID
from datetime import date
from app.schemas.ocr import LineItem, FieldConfidence

class AnalysisResult(BaseModel):
    category: str
    confidence: float
    description: Optional[str] = None
    tags: List[str] = []
    merchant_name: Optional[str] = None
    amount: Optional[float] = None
    date: Optional[Any] = None
    currency: Optional[str] = "INR"
    type: Optional[str] = "RECEIPT"  # RECEIPT, BILL, INVOICE
    transaction_type: Optional[str] = "EXPENSE"  # EXPENSE or INCOME
    line_items: List[LineItem] = []
    # Bill/Invoice specific fields
    bill_number: Optional[str] = None
    due_date: Optional[Any] = None
    invoice_number: Optional[str] = None
    location: Optional[str] = None
    vendor: Optional[str] = None
    payment_method: Optional[str] = None
    document_type: Optional[str] = "RECEIPT"  # RECEIPT, BILL, INVOICE
    # Field-level confidence
    field_confidence: Optional[Dict[str, float]] = None

    @field_validator("date", "due_date", mode="before")
    @classmethod
    def serialize_date(cls, v: Any) -> Any:
        if isinstance(v, date):
            return v.isoformat()
        return v

class AnalysisResponse(BaseModel):
    filename: str
    analysis: AnalysisResult
    file_id: Optional[UUID] = None
