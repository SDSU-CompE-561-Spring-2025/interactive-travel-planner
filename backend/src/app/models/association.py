from sqlalchemy import Column, Integer, String, ForeignKey, Table
from sqlalchemy.orm import relationship
from app.database import Base


itinerary_trip_association = Table(
    'itinerary_trip', Base.metadata,
    Column('trip_id', Integer, ForeignKey('trips.id')),
    Column('itinerary_id', Integer, ForeignKey('itineraries.id'))
)

trip_collaborators = Table(
    'trip_collaborators',
    Base.metadata,
    Column('trip_id', Integer, ForeignKey('trips.id')),
    Column('user_id', Integer, ForeignKey('users.id'))
)
