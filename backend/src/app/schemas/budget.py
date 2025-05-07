from pydantic import BaseModel

class BudgetBase(BaseModel):
    category: str
    amount: float

class BudgetCreate(BudgetBase):
    pass

class BudgetResponse(BudgetBase):
    id: int
    class Config:
        orm_mode = True
