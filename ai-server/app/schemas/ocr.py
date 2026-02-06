from typing import List, Optional
from pydantic import BaseModel
from datetime import date

class LineItem(BaseModel):
    description: str
    amount: float
    quantity: Optional[int] = 1

class ReceiptData(BaseModel):
    merchant_name: Optional[str] = None
    transaction_date: Optional[date] = None
    total_amount: Optional[float] = None
    tax_amount: Optional[float] = None
    currency: str = "INR"
    category: Optional[str] = "Uncategorized"
    line_items: List[LineItem] = []

class OCRResponse(BaseModel):
    extracted_data: ReceiptData
    confidence_score: float
