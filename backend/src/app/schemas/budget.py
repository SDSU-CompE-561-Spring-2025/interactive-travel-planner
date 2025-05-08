from pydantic import BaseModel
from enum import Enum
from datetime import datetime
from typing import Optional

class BudgetBase(BaseModel):
    amount: float
    currency: Optional[str]= None
    description: Optional[str] = None
    category: Optional[str]= None
    
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
