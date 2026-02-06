from pydantic import BaseModel
from typing import List, Optional

class ChatRequest(BaseModel):
    message: str
    context_filters: Optional[dict] = None  # e.g., {"date_range": "last_month"}

class ChatResponse(BaseModel):
    response: str
    sources: List[str] = []
