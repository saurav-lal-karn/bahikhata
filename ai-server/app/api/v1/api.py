from fastapi import APIRouter
from app.api.v1.endpoints import ocr, chat, forecasting, analyzer

api_router = APIRouter()
api_router.include_router(ocr.router, prefix="/ocr", tags=["ocr"])
api_router.include_router(chat.router, prefix="/chat", tags=["chat"])
api_router.include_router(forecasting.router, prefix="/forecast", tags=["forecasting"])
api_router.include_router(analyzer.router, prefix="/analyzer", tags=["analyzer"])
