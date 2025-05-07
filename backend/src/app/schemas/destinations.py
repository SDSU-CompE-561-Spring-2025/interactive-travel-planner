from pydantic import BaseModel

class DestinationBase(BaseModel):
    name: str
    location: str

class DestinationCreate(DestinationBase):
    pass

class DestinationResponse(DestinationBase):
    id: int
    class Config:
        orm_mode = True
