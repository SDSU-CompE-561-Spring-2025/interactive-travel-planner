from sqlalchemy import Column, Integer, Date, ForeignKey
from sqlalchemy.orm import relationship
from app.core.database import Base

class Date(Base):
    __tablename__ = "dates"

    id = Column(Integer, primary_key=True)
    trip_id = Column(Integer, ForeignKey("trips.id"))
    date = Column(Date)

    trip = relationship("Trip", back_populates="dates")
