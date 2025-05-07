from sqlalchemy import Column, Integer, String, DateTime, ForeignKey
from sqlalchemy.orm import relationship
from app.core.database import Base
from datetime import datetime, UTC

class CalendarEvent(Base):
    __tablename__ = "calendar_events"

    id = Column(Integer, primary_key=True)
    trip_id = Column(Integer, ForeignKey("trips.id"))
    title = Column(String)
    start_time = Column(DateTime, default=datetime.now(UTC))
    end_time = Column(DateTime, default=datetime.now(UTC))
    description = Column(String)

    trip = relationship("Trip", back_populates="calendar_events")
