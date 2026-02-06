from fastapi import APIRouter
from app.schemas.common import ResponseBase
from app.services.forecast_service import forecast_service

router = APIRouter()

@router.get("/budget", response_model=ResponseBase[dict])
async def get_budget_forecast():
    # TODO: Get user_id from auth context
    user_id = "test_user"
    result = await forecast_service.predict_budget(user_id)
    return ResponseBase(data=result)
