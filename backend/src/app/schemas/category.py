from enum import Enum

from pydantic import BaseModel


class TransactionType(str, Enum):
    income = "income"
    expense = "expense"


class CategoryBase(BaseModel):
    category_name: str
    category_type: TransactionType


class CategoryCreate(CategoryBase):
    pass


class CategoryResponse(CategoryBase):
    id: int

    class Config:
        from_attributes = True
