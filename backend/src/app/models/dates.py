from sqlalchemy import Column, Integer, Date, ForeignKey
from sqlalchemy.orm import relationship
from app.core.database import Base

class Dates(Base):
    __tablename__ = 'dates'

    id = Column(Integer, primary_key=True)  # unique ID for the date entry
    trip_id = Column(Integer, ForeignKey('trips.id'), nullable=False, unique=True)  # links to destination
    start_date = Column(Date, nullable=False)  # trip start
    end_date = Column(Date, nullable=False)  # trip end

    def to_dict(self):
        return {
            'id': self.id,
            'trip_id': self.trip_id,
            'start_date': self.start_date.isoformat() if self.start_date else None,
            'end_date': self.end_date.isoformat() if self.end_date else None
        }
    
    trip = relationship("Trip", back_populates="dates")
