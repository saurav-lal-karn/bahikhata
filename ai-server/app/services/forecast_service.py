class ForecastService:
    async def predict_budget(self, user_id: str):
        # TODO: Implement forecasting logic
        return {"status": "On Track", "projected_spend": 25000}

forecast_service = ForecastService()
