from pydantic import BaseModel
from datetime import date

class DatesBase(BaseModel):
    start_date: date
    end_date: date

class DatesCreate(DatesBase):
    pass

class DatesRead(DatesBase):
    id: int
    trip_id: int

    model_config = {"from_attributes": True}
