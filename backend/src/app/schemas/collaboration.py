from pydantic import BaseModel
from datetime import datetime

class CollaborationBase(BaseModel):
    trip_id: int
    user_id: int
    role: str

class CollaborationCreate(CollaborationBase):
    pass

class Collaboration(CollaborationBase):
    id: int
    invited_at: datetime

    class Config:
        orm_mode = True

