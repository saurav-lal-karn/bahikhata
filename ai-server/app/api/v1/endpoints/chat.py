from fastapi import APIRouter
from app.schemas.common import ResponseBase
from app.schemas.chat import ChatRequest, ChatResponse
from app.services.llm_service import llm_service

router = APIRouter()

@router.post("/query", response_model=ResponseBase[ChatResponse])
async def chat_query(request: ChatRequest):
    result = await llm_service.chat(request.message, request.context_filters)
    return ResponseBase(data=result)
