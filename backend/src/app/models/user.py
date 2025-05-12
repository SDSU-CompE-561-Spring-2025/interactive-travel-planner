from sqlalchemy import Column, Integer, String, ForeignKey, Table
from sqlalchemy.orm import relationship
from ..database import Base
from .itineraries import Itinerary
from .association import itinerary_trip_association


class User(Base):
    __tablename__ = 'users'
    id = Column(Integer, primary_key=True, index=True)
    username = Column(String, unique=True, index=True)
    email = Column(String, unique=True, index=True)
    hashed_password = Column(String)


Itinerary.trips = relationship('Trip', secondary=itinerary_trip_association, back_populates='itineraries')
