from pydantic import BaseModel
from typing import List, Optional

class AnalysisResult(BaseModel):
    category: str
    confidence: float
    description: Optional[str] = None
    tags: List[str] = []

class AnalysisResponse(BaseModel):
    filename: str
    analysis: AnalysisResult
