from sqlalchemy import Column, Integer Date
from app.database import Base

class Trip(Baes):
    __tablename__ = "trips"

    id = Column(Integer, primary_key=True, index=True)
    start_date = Column(Date, nullable=True)
    end_date = Column(Date, nullable=True)

