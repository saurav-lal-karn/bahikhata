from app.schemas.ocr import OCRResponse, ReceiptData

class OCRService:
    async def process_receipt(self, file_contents: bytes) -> OCRResponse:
        # TODO: Implement integration with Gemini/Tesseract
        # For now, return dummy data
        data = ReceiptData(
            merchant_name="Sample Store",
            total_amount=100.0,
            currency="INR",
            category="Groceries"
        )
        return OCRResponse(extracted_data=data, confidence_score=0.95)

ocr_service = OCRService()
