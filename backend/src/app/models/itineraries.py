from sqlalchemy import Column, Integer, String, ForeignKey, DateTime
from sqlalchemy.orm import relationship
from datetime import UTC, datetime
from app.database import Base

from app.models.association import itinerary_trip_association


class Itinerary(Base): #workout --> itinerary
    __tablename__ = 'itineraries'
    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey('users.id'))
    name = Column(String, index=True)
    description = Column(String, index=True)
    start_date = Column(DateTime, default=datetime.now(UTC))
    end_date = Column(DateTime, default=datetime.now(UTC))

    trips = relationship('Trip', secondary=itinerary_trip_association, back_populates='itineraries')
