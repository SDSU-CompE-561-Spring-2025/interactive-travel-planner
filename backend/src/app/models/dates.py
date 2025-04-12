from sqlalchemy import Column, Integer, Date, ForeignKey
from sqlalchemy.orm import relationship
from app.core.database import Base

class Dates(Base):
    __tablename__ = 'dates'

    id = Column(Integer, primary_key=True)
    trip_id = Column(Integer, ForeignKey('destinations.id'), nullable=False, unique=True)
    start_date = Column(Date, nullable=False)
    end_date = Column(Date, nullable=False)

    destination = relationship('Destination', back_populates='dates', uselist=False)

    def to_dict(self):
        return {
            'id': self.id,
            'trip_id': self.trip_id,
            'start_date': self.start_date.isoformat() if self.start_date else None,
            'end_date': self.end_date.isoformat() if self.end_date else None
        }
