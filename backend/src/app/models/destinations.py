from datetime import UTC, datetime
from sqlalchemy import Column, DateTime, ForeignKey, Integer, String
from sqlalchemy.orm import relationship
from app.core.database import Base

class Destinations(Base):
    __tablename__ = "destinations"

    id = Column(Integer, primary_key=True, index=True)
    trip_id = Column(Integer, ForeignKey("trips.id"))
    name = Column(String)
    description = Column(String)
    location = Column(String)
    order = Column(Integer)
    created_at = Column(DateTime, default=datetime.now(UTC))
    updated_at = Column(DateTime, default=datetime.now(UTC), onupdate=datetime.now(UTC))

    trip = relationship("Trips")
    itineraries = relationship("Itinerary", back_populates="destination")
    dates = relationship("Dates", back_populates="destination", uselist=False)  # ✅ Added for Dates sync
