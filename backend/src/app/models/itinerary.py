from sqlalchemy import Column, Integer, String, DateTime, ForeignKey
from sqlalchemy.orm import relationship
from app.core.database import Base

class Itinerary(Base):
    __tablename__ = 'itineraries'

    id = Column(Integer, primary_key=True)
    trip_id = Column(Integer, ForeignKey('destinations.id'), nullable=False)
    name = Column(String(100), nullable=False)
    time = Column(DateTime, nullable=False)
    description = Column(String(255))
    location = Column(String(100))

    destination = relationship('Destinations', back_populates='itineraries')

    def to_dict(self):
        return {
            'id': self.id,
            'trip_id': self.trip_id,
            'name': self.name,
            'time': self.time.isoformat() if self.time else None,
            'description': self.description,
            'location': self.location
        }
