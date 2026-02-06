from app.schemas.chat import ChatResponse

class LLMService:
    async def chat(self, message: str, context: dict = None) -> ChatResponse:
        # TODO: Implement RAG and LLM call
        return ChatResponse(
            response=f"Echo: {message}. I am Bahi-Bot, your financial assistant.",
            sources=["Transaction History"]
        )

llm_service = LLMService()
