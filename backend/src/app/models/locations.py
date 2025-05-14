from sqlalchemy import Column, Integer, String, ForeignKey, Float, Text
from sqlalchemy.orm import relationship
from app.database import Base

class Location(Base):
    __tablename__ = 'locations'

    id = Column(Integer, primary_key=True, index=True)
    itinerary_id = Column(Integer, ForeignKey('itineraries.id', ondelete='CASCADE'))
    name = Column(String, index=True)
    description = Column(Text, nullable=True)
    latitude = Column(Float)
    longitude = Column(Float)

    itinerary = relationship('Itinerary', back_populates='locations') 