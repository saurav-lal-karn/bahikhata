import httpx
import logging
from typing import Any, Dict
from app.core.config import settings

logger = logging.getLogger(__name__)

class NotificationService:
    def __init__(self):
        # In a real app, this should be the internal backend URL
        self.backend_url = f"http://localhost:3080/api/internal/notifications"
        if hasattr(settings, "BACKEND_INTERNAL_URL") and settings.BACKEND_INTERNAL_URL:
             self.backend_url = f"{settings.BACKEND_INTERNAL_URL}/api/internal/notifications"

    async def send_notification(
        self, 
        user_id: str, 
        family_id: str, 
        title: str, 
        message: str, 
        n_type: str = "TASK_PROGRESS"
    ):
        payload = {
            "user_id": user_id,
            "family_id": family_id,
            "title": title,
            "message": message,
            "type": n_type
        }
        
        try:
            async with httpx.AsyncClient() as client:
                response = await client.post(self.backend_url, json=payload)
                response.raise_for_status()
                return True
        except Exception as e:
            logger.error(f"Failed to send notification to backend: {e}")
            return False

notification_service = NotificationService()
