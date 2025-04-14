from pydantic import BaseModel
from enum import Enum
from datetime import datetime
from typing import Optional

class BudgetBase(BaseModel):
    amount: float
    currency: str
    description: Optional[str] = None
    category: str