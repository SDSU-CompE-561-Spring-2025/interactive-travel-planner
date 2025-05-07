
from sqlalchemy import Column, DateTime, ForeignKey, Integer, String
from sqlalchemy.orm import relationship
from datetime import datetime, UTC

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

    trip = relationship("Trip", back_populates="destinations")