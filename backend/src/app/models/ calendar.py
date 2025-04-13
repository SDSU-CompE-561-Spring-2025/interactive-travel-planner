from sqlalchemy import Column, Integer Date
from app.dependencies import Base
from sqlalchemy import ForeignKey
from sqlalchemy.orm import relationshp

class Trip(Baes):
    __tablename__ = "trips"

    id = Column(Integer, primary_key=True, index=True)
    start_date = Column(Date, nullable=True)
    end_date = Column(Date, nullable=True)

    user_id = Column(Integer, ForeignKey("users.id"))
    user = relationship("User", back_populates="trips")

