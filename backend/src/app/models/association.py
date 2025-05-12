from sqlalchemy import Column, Integer, String, ForeignKey, Table
from sqlalchemy.orm import relationship
from ..database import Base


itinerary_trip_association = Table(
    'itinerary_trip_association',
    Base.metadata,
    Column('itinerary_id', Integer, ForeignKey('itineraries.id')),
    Column('trip_id', Integer, ForeignKey('trips.id'))
)
