from fastapi import APIRouter, UploadFile, File, HTTPException
from app.schemas.common import ResponseBase
from app.schemas.ocr import OCRResponse
from app.services.ocr_service import ocr_service

router = APIRouter()

@router.post("/receipt", response_model=ResponseBase[OCRResponse])
async def upload_receipt(file: UploadFile = File(...)):
    if not file.content_type.startswith("image/") and file.content_type != "application/pdf":
        raise HTTPException(status_code=400, detail="Invalid file type")
    
    contents = await file.read()
    result = await ocr_service.process_receipt(contents)
    return ResponseBase(data=result)
