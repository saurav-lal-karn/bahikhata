import pytesseract
from PIL import Image, ImageEnhance, ImageFilter
import io
from groq import Groq
import uuid
import json
from datetime import datetime
from typing import Tuple, Dict

from app.schemas.ocr import OCRResponse, ReceiptData, FieldConfidence
from app.core.config import settings
from app.services.vector_db_service import vector_db_service

class OCRService:
    def __init__(self):
        self.groq_client = Groq(api_key=settings.GROQ_API_KEY)
        if settings.TESSERACT_CMD:
            pytesseract.pytesseract.tesseract_cmd = settings.TESSERACT_CMD

    async def preprocess_image(self, image: Image.Image) -> Image.Image:
        """
        Preprocess image to improve OCR accuracy
        - Resize if too large
        - Enhance contrast
        - Denoise
        """
        try:
            # Resize if image is too large (max 2000px on longest side)
            max_size = 2000
            if max(image.size) > max_size:
                ratio = max_size / max(image.size)
                new_size = tuple(int(dim * ratio) for dim in image.size)
                image = image.resize(new_size, Image.Resampling.LANCZOS)
            
            # Convert to grayscale for better OCR
            if image.mode != 'L':
                image = image.convert('L')
            
            # Enhance contrast
            enhancer = ImageEnhance.Contrast(image)
            image = enhancer.enhance(1.5)
            
            # Denoise
            image = image.filter(ImageFilter.MedianFilter(size=3))
            
            # Sharpen
            image = image.filter(ImageFilter.SHARPEN)
            
            return image
        except Exception as e:
            print(f"Preprocessing error: {e}")
            return image  # Return original if preprocessing fails

    async def extract_text_from_image(self, file_contents: bytes, filename: str = "") -> Tuple[str, bool]:
        """
        Extract text using Tesseract OCR
        Returns: (extracted_text, is_high_quality)
        """
        try:
            if filename.lower().endswith('.pdf') or (not filename and file_contents.startswith(b'%PDF')):
                from pdf2image import convert_from_bytes
                images = convert_from_bytes(file_contents)
                extracted_text = ""
                for img in images:
                    # Preprocess each page
                    processed_img = await self.preprocess_image(img)
                    extracted_text += pytesseract.image_to_string(processed_img) + "\n"
            else:
                image = Image.open(io.BytesIO(file_contents))
                # Preprocess image
                processed_image = await self.preprocess_image(image)
                extracted_text = pytesseract.image_to_string(processed_image)
            
            # Determine if OCR quality is good (basic heuristic)
            is_high_quality = len(extracted_text.strip()) > 20 and extracted_text.count('\n') > 2
            
            return extracted_text, is_high_quality
        except Exception as e:
            print(f"OCR Error: {e}")
            return "", False

    async def detect_document_type(self, text: str) -> str:
        """
        Detect document type from extracted text
        Returns: RECEIPT, BILL, or INVOICE
        """
        text_lower = text.lower()
        
        # Bill indicators
        bill_keywords = ['bill', 'due date', 'account number', 'billing period', 'amount due', 'utility']
        bill_score = sum(1 for keyword in bill_keywords if keyword in text_lower)
        
        # Invoice indicators
        invoice_keywords = ['invoice', 'invoice number', 'invoice date', 'payment terms', 'net 30', 'vendor']
        invoice_score = sum(1 for keyword in invoice_keywords if keyword in text_lower)
        
        # Receipt indicators
        receipt_keywords = ['receipt', 'thank you', 'total', 'change', 'cash', 'card']
        receipt_score = sum(1 for keyword in receipt_keywords if keyword in text_lower)
        
        # Determine document type
        scores = {
            'BILL': bill_score,
            'INVOICE': invoice_score,
            'RECEIPT': receipt_score
        }
        
        return max(scores, key=scores.get) if max(scores.values()) > 0 else 'RECEIPT'

    async def extract_and_classify(self, file_contents: bytes, filename: str = "") -> Dict:
        """
        Step 1: Extract text and classify transaction type/category
        """
        extracted_text, is_high_quality = await self.extract_text_from_image(file_contents, filename)
        
        if not extracted_text.strip():
            return {
                "ocr_text": "",
                "transaction_type": "EXPENSE",
                "category": "Uncategorized",
                "confidence_score": 0.0
            }

        document_type = await self.detect_document_type(extracted_text)
        
        # Use a lightweight Groq call for classification
        prompt = f"""
        Classify this document text. 
        1. Determine if it's an EXPENSE (money out) or INCOME (money in).
        2. Suggest a category (e.g. Groceries, Dining, Salary, etc.).
        
        Return ONLY JSON:
        {{
            "transaction_type": "EXPENSE or INCOME",
            "category": "string",
            "confidence": float (0.0-1.0)
        }}

        Text:
        {extracted_text[:2000]} 
        """
        
        try:
            chat_completion = self.groq_client.chat.completions.create(
                messages=[{"role": "user", "content": prompt}],
                model=settings.GROQ_MODEL,
                response_format={"type": "json_object"}
            )
            classification = json.loads(chat_completion.choices[0].message.content)
            
            return {
                "ocr_text": extracted_text,
                "transaction_type": classification.get("transaction_type", "EXPENSE"),
                "category": classification.get("category", "Uncategorized"),
                "confidence_score": classification.get("confidence", 0.5)
            }
        except Exception as e:
            print(f"Classification Error: {e}")
            return {
                "ocr_text": extracted_text,
                "transaction_type": "EXPENSE",
                "category": "Uncategorized",
                "confidence_score": 0.3
            }

    async def extract_structured_data(self, ocr_text: str, transaction_type: str, category: str = "") -> OCRResponse:
        """
        Step 2: Full structured extraction based on confirmed type/category
        """
        document_type = await self.detect_document_type(ocr_text)
        prompt = self._build_extraction_prompt(ocr_text, document_type)
        
        # Inject confirmed type/category into prompt instructions
        prompt = f"Note: User confirmed this is a {transaction_type} in category {category}.\n\n" + prompt

        try:
            chat_completion = self.groq_client.chat.completions.create(
                messages=[
                    {
                        "role": "system",
                        "content": "You are a helpful assistant that extracts structured data from financial documents. Return ONLY JSON."
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
            field_confidence_data = extracted_json.pop('field_confidence', {})
            field_confidence = FieldConfidence(**field_confidence_data)
            
            confidence_values = [v for v in field_confidence_data.values() if v is not None]
            overall_confidence = sum(confidence_values) / len(confidence_values) if confidence_values else 0.5
            
            data = ReceiptData(**extracted_json)
            data.document_type = document_type
            data.transaction_type = transaction_type # Ensure it matches user confirmation
            if category:
                data.category = category

            return OCRResponse(
                extracted_data=data,
                confidence_score=overall_confidence,
                field_confidence=field_confidence
            )
        except Exception as e:
            print(f"Extraction Error: {e}")
            raise e

    async def process_receipt(self, file_contents: bytes, filename: str = "", document_type: str = "") -> OCRResponse:
        """
        Backward compatibility: Process document in one go
        """
        classification = await self.extract_and_classify(file_contents, filename)
        return await self.extract_structured_data(
            ocr_text=classification["ocr_text"],
            transaction_type=classification["transaction_type"],
            category=classification["category"]
        )

    def _build_extraction_prompt(self, text: str, document_type: str) -> str:
        """Build LLM prompt based on document type"""
        
        base_fields = """
            "merchant_name": "string",
            "vendor": "string (the brand or person paid)",
            "location": "string (city or address)",
            "payment_method": "string (e.g. Cash, Card, UPI, Amazon Pay)",
            "transaction_date": "YYYY-MM-DD",
            "total_amount": float,
            "tax_amount": float,
            "currency": "string",
            "category": "string (suggest a relevant category)",
            "transaction_type": "EXPENSE or INCOME",
            "description": "string (short 1-line summary)",
            "tags": ["tag1", "tag2"],
            "line_items": [
                {"description": "string", "amount": float, "quantity": int}
            ]
        """
        
        if document_type == "BILL":
            specific_fields = """
            "bill_number": "string",
            "due_date": "YYYY-MM-DD",
            "account_number": "string (optional)"
            """
        elif document_type == "INVOICE":
            specific_fields = """
            "invoice_number": "string",
            "due_date": "YYYY-MM-DD",
            "payment_terms": "string (optional)"
            """
        elif document_type == "EXPENSE":
            specific_fields = """
            "bill_number": "string",
            "due_date": "YYYY-MM-DD",
            "account_number": "string (optional)"
            """
        else:  # RECEIPT
            specific_fields = ""
        
        prompt = f"""
        Extract the following information from this {document_type} text. 
        Return ONLY a JSON object with this structure:
        {{
            {base_fields}
            {specific_fields if specific_fields else ""}
            "field_confidence": {{
                "merchant_name": float (0.0-1.0),
                "transaction_date": float (0.0-1.0),
                "total_amount": float (0.0-1.0),
                "tax_amount": float (0.0-1.0),
                "category": float (0.0-1.0),
                "transaction_type": float (0.0-1.0),
                "vendor": float (0.0-1.0),
                "location": float (0.0-1.0),
                "payment_method": float (0.0-1.0),
                "tags": float (0.0-1.0),
                "description": float (0.0-1.0)
                {', "bill_number": float (0.0-1.0), "due_date": float (0.0-1.0)' if document_type == "BILL" else ''}
                {', "invoice_number": float (0.0-1.0), "due_date": float (0.0-1.0)' if document_type == "INVOICE" else ''}
            }}
        }}

        IMPORTANT Instructions:
        1. Determine if this is an EXPENSE (money going out) or INCOME (money coming in)
        2. For each field, provide a confidence score (0.0-1.0) indicating how certain you are
        3. Use 1.0 for fields you're very confident about, 0.5 for uncertain, 0.0 for missing
        4. If a field is not found, use null and set confidence to 0.0
        5. Suggest an appropriate category based on the merchant/description

        Document Text:
        {text}
        """
        
        return prompt

ocr_service = OCRService()
