<<<<<<< HEAD
from datetime import UTC, datetime
from sqlalchemy import Column, DateTime, ForeignKey, Integer, String
from sqlalchemy.orm import relationship
=======
from sqlalchemy import Column, DateTime, ForeignKey, Integer, String
from sqlalchemy.orm import relationship
from datetime import datetime, UTC

>>>>>>> bc85766232baa31c65e2e29401b3951e42ec4d52
from app.core.database import Base

class Destinations(Base):
    __tablename__ = "destinations"

    id = Column(Integer, primary_key=True, index=True)
    name = Column(String, nullable=False)
    location = Column(String, nullable=False)

    description = Column(String, nullable=True)
    order = Column(String, nullable=True)

    trip_id = Column(Integer, ForeignKey("trips.id"))

    created_at = Column(DateTime, default=datetime.now(UTC))
    updated_at = Column(DateTime, default=datetime.now(UTC), onupdate=datetime.now(UTC))

    trip = relationship("Trips")
    itineraries = relationship("Itinerary", back_populates="destination")
    dates = relationship("Dates", back_populates="destination", uselist=False)  # ✅ Added for Dates sync
