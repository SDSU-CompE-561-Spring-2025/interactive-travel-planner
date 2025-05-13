from sqlalchemy import Column, Integer, String, ForeignKey, Table
from sqlalchemy.orm import relationship
from app.database import Base
from app.models.itineraries import Itinerary
from app.models.association import itinerary_trip_association, trip_collaborators


class User(Base):
    __tablename__ = 'users'
    id = Column(Integer, primary_key=True, index=True)
    username = Column(String, unique=True, index=True)
    email = Column(String, unique=True, index=True)
    hashed_password = Column(String)

    collaborating_trips = relationship(
        "Trip",
        secondary=trip_collaborators,
        back_populates="collaborators"
    )


Itinerary.trips = relationship('Trip', secondary=itinerary_trip_association, back_populates='itineraries')
