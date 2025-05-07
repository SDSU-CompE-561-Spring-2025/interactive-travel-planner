from pydantic import BaseModel
from enum import Enum
from datetime import datetime
from typing import Optional

class BudgetBase(BaseModel):
    amount: float
    currency: str
    description: Optional[str] = None
    category: str

# For creating a new budget
class BudgetCreate(BudgetBase):
    pass

# For updating an existing budget
class BudgetUpdate(BudgetBase):
    pass

# For reading from the database
class BudgetOut(BudgetBase):
    id: int
    trip_id: int
    created_at: datetime
    updated_at: datetime

    class Config:
        from_attributes = True
