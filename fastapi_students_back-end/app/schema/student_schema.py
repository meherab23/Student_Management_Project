from pydantic import BaseModel
from typing import Optional

class Student(BaseModel):
    name: str
    phone: str
    email: str
    file: Optional[str]  # Field to store the uploaded file path
