from typing import List, Optional, Dict
from pydantic import BaseModel
from datetime import date

class LineItem(BaseModel):
    description: str
    amount: float
    quantity: Optional[int] = 1

class FieldConfidence(BaseModel):
    """Confidence score for individual fields"""
    merchant_name: Optional[float] = None
    transaction_date: Optional[float] = None
    total_amount: Optional[float] = None
    tax_amount: Optional[float] = None
    category: Optional[float] = None
    transaction_type: Optional[float] = None
    bill_number: Optional[float] = None
    due_date: Optional[float] = None
    invoice_number: Optional[float] = None
    location: Optional[float] = None
    vendor: Optional[float] = None
    payment_method: Optional[float] = None
    tags: Optional[float] = None
    description: Optional[float] = None

class ReceiptData(BaseModel):
    merchant_name: Optional[str] = None
    transaction_date: Optional[date] = None
    total_amount: Optional[float] = None
    tax_amount: Optional[float] = None
    currency: str = "INR"
    category: Optional[str] = "Uncategorized"
    transaction_type: Optional[str] = "EXPENSE"  # EXPENSE or INCOME
    location: Optional[str] = None
    vendor: Optional[str] = None
    payment_method: Optional[str] = None
    tags: List[str] = []
    description: Optional[str] = None
    line_items: List[LineItem] = []
    # Bill/Invoice specific fields
    bill_number: Optional[str] = None
    due_date: Optional[date] = None
    invoice_number: Optional[str] = None
    document_type: Optional[str] = "RECEIPT"  # RECEIPT, BILL, INVOICE

class ClassificationResult(BaseModel):
    ocr_text: str
    transaction_type: str
    category: Optional[str] = None
    confidence_score: float

class OCRResponse(BaseModel):
    extracted_data: ReceiptData
    confidence_score: float
    field_confidence: Optional[FieldConfidence] = None  # Field-level confidence scores
