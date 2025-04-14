from sqlalchemy import Column, Integer, String, DateTime, ForeignKey
from sqlalchemy.orm import relationship
from app.core.database import Base

class Itinerary(Base):
    __tablename__ = 'itineraries'

    id = Column(Integer, primary_key=True)  # unique ID for each itinerary
    trip_id = Column(Integer, ForeignKey('destinations.id'), nullable=False)  # links to a destination
    name = Column(String(100), nullable=False)  # name of the itinerary item
    time = Column(DateTime, nullable=False)  # when it's scheduled
    description = Column(String(255))  # optional description
    location = Column(String(100))  # optional location

    destination = relationship('Destinations', back_populates='itineraries')  # connect back to destination

    def to_dict(self):
        return {
            'id': self.id,
            'trip_id': self.trip_id,
            'name': self.name,
            'time': self.time.isoformat() if self.time else None,  # format datetime for JSON
            'description': self.description,
            'location': self.location
        }
