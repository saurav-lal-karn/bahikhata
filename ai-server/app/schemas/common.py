from typing import Generic, TypeVar, Optional
from pydantic import BaseModel

DataT = TypeVar("DataT")

class ResponseBase(BaseModel, Generic[DataT]):
    success: bool = True
    message: str = "Success"
    data: Optional[DataT] = None
