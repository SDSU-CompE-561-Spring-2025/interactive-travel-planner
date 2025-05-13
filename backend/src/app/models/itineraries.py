from sqlalchemy import Column, Integer, String, ForeignKey, DateTime, Float, JSON
from sqlalchemy.orm import relationship
from datetime import UTC, datetime
from ..database import Base
from .association import itinerary_trip_association
from fastapi import HTTPException, status
from sqlalchemy.inspection import inspect

class Location(Base):
    __tablename__ = 'locations'
    id = Column(Integer, primary_key=True, index=True)
    itinerary_id = Column(Integer, ForeignKey('itineraries.id'))
    name = Column(String, index=True)
    coordinates = Column(JSON)  # Stores {lat: float, lng: float}
    date = Column(DateTime)
    start_date = Column(DateTime)
    end_date = Column(DateTime)
    color = Column(String, nullable=True)  # New field for color
    comments = Column(String, nullable=True)  # New field for comments

    itinerary = relationship("Itinerary", back_populates="locations")

class Transportation(Base):
    __tablename__ = 'transportation'
    id = Column(Integer, primary_key=True, index=True)
    itinerary_id = Column(Integer, ForeignKey('itineraries.id'))
    type = Column(String)  # e.g., "Flight", "Train", "Bus"
    from_location = Column(String)
    to_location = Column(String)
    departure_date = Column(DateTime)
    departure_time = Column(String)
    arrival_date = Column(DateTime)
    arrival_time = Column(String)
    provider = Column(String)  # e.g., "Delta", "Amtrak"

    itinerary = relationship("Itinerary", back_populates="transportation")

class Activity(Base):
    __tablename__ = 'activities'
    id = Column(Integer, primary_key=True, index=True)
    itinerary_id = Column(Integer, ForeignKey('itineraries.id'))
    location_id = Column(Integer, ForeignKey('locations.id'))
    name = Column(String)
    date = Column(DateTime)
    time = Column(String)
    duration = Column(String)
    location = Column(String)  # Specific location within the destination
    notes = Column(String, nullable=True)
    category = Column(String)  # e.g., "Sightseeing", "Food & Drink"
    coordinates = Column(JSON, nullable=True)  # Optional specific coordinates

    itinerary = relationship("Itinerary", back_populates="activities")
    location_rel = relationship("Location")

class Itinerary(Base): #workout --> itinerary
    __tablename__ = 'itineraries'
    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey('users.id'))
    name = Column(String, index=True)
    description = Column(String, index=True)
    start_date = Column(DateTime, default=datetime.now(UTC))
    end_date = Column(DateTime, default=datetime.now(UTC))

    trips = relationship('Trip', secondary=itinerary_trip_association, back_populates='itineraries')
    locations = relationship('Location', back_populates='itinerary', cascade="all, delete-orphan")
    transportation = relationship('Transportation', back_populates='itinerary', cascade="all, delete-orphan")
    activities = relationship('Activity', back_populates='itinerary', cascade="all, delete-orphan")

    @classmethod
    def update_itinerary(cls, db, itinerary_id: int, data: dict):
        db_itin = db.get(cls, itinerary_id)
        if not db_itin:
            raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Itinerary not found")

        if "trips" in data:
            from .trips import Trip
            trip_ids = data.pop("trips") or []
            db_itin.trips = (
                db.query(Trip)
                    .filter(Trip.id.in_(trip_ids))
                    .all()
            )

        # 2) handle real columns
        mapper = inspect(cls)
        for field, val in data.items():
            if field in mapper.columns:
                setattr(db_itin, field, val)

        db.commit()
        db.refresh(db_itin)
        return db_itin
