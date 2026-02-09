import pytesseract
from PIL import Image
import io
from groq import Groq
import uuid
import json
from datetime import datetime

from app.schemas.ocr import OCRResponse, ReceiptData
from app.core.config import settings
from app.services.vector_db_service import vector_db_service

class OCRService:
    def __init__(self):
        self.groq_client = Groq(api_key=settings.GROQ_API_KEY)
        if settings.TESSERACT_CMD:
            pytesseract.pytesseract.tesseract_cmd = settings.TESSERACT_CMD

    async def process_receipt(self, file_contents: bytes, filename: str = "") -> OCRResponse:
        # 1. Extract text using Tesseract
        try:
            if filename.lower().endswith('.pdf') or (not filename and file_contents.startswith(b'%PDF')):
                from pdf2image import convert_from_bytes
                images = convert_from_bytes(file_contents)
                extracted_text = ""
                for img in images:
                    extracted_text += pytesseract.image_to_string(img) + "\n"
            else:
                image = Image.open(io.BytesIO(file_contents))
                extracted_text = pytesseract.image_to_string(image)
        except Exception as e:
            # Fallback for basic error handling, in real app would be more robust
            extracted_text = ""
            print(f"OCR Error: {e}")

        # 2. Store in Vector DB
        doc_id = str(uuid.uuid4())
        vector_db_service.add_document(
            doc_id=doc_id,
            text=extracted_text,
            metadata={"timestamp": datetime.now().isoformat(), "type": "receipt"}
        )

        # 3. Use Groq to generate structured JSON
        prompt = f"""
        Extract the following information from the receipt text provided below. 
        Return ONLY a JSON object matching this structure:
        {{
            "merchant_name": "string",
            "transaction_date": "YYYY-MM-DD",
            "total_amount": float,
            "tax_amount": float,
            "currency": "string",
            "category": "string",
            "line_items": [
                {{"description": "string", "amount": float, "quantity": int}}
            ]
        }}

        Receipt Text:
        {extracted_text}
        """

        try:
            chat_completion = self.groq_client.chat.completions.create(
                messages=[
                    {
                        "role": "system",
                        "content": "You are a helpful assistant that extracts structured data from receipt text. Return ONLY JSON."
                    },
                    {
                        "role": "user",
                        "content": prompt,
                    }
                ],
                model=settings.GROQ_MODEL,
                response_format={"type": "json_object"}
            )
            
            extracted_json = json.loads(chat_completion.choices[0].message.content)
            data = ReceiptData(**extracted_json)
            confidence = 0.9  # Estimated default confidence or calculated from LLM if possible
        except Exception as e:
            print(f"Groq Error: {e}")
            # Fallback data if LLM fails
            data = ReceiptData(
                merchant_name="Unknown",
                total_amount=0.0,
                currency="INR",
                category="Uncategorized"
            )
            confidence = 0.0

        return OCRResponse(extracted_data=data, confidence_score=confidence)

ocr_service = OCRService()
