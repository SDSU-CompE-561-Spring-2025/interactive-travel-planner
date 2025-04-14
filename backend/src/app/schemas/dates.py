from pydantic import BaseModel
from datetime import date

# Base schema with shared fields
class DatesBase(BaseModel):
    start_date: date
    end_date: date

# Schema for creating date entries
class DatesCreate(DatesBase):
    pass

# Schema for reading date entries (includes ID and trip ID)
class DatesRead(DatesBase):
    id: int
    trip_id: int

    model_config = {"from_attributes": True}  # enables ORM parsing
