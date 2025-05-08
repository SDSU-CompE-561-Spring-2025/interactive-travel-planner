from datetime import UTC, datetime
import enum

from sqlalchemy import Column, DateTime, Enum, ForeignKey, Integer, String
from sqlalchemy.orm import relationship

from app.core.database import Base
from sqlalchemy.dialects.postgresql import UUID
import uuid


class Trips(Base):
    __tablename__ = "trips"

    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    user_id = Column(Integer, ForeignKey("users.id"))
    title = Column(String)
    description = Column(String)

    start_date = Column(DateTime, default=datetime.now(UTC))
    end_date = Column(DateTime, default=datetime.now(UTC))
    created_at = Column(DateTime, default=datetime.now(UTC))
    updated_at = Column(DateTime, default=datetime.now(UTC), onupdate=datetime.now(UTC))

    user = relationship("User", back_populates="trips")
    destinations = relationship("Destination", back_populates="trip", cascade="all, delete-orphan")
    budgets = relationship("Budget", back_populates="trip", cascade="all, delete-orphan")
    calendar_events = relationship("CalendarEvent", back_populates="trip", cascade="all, delete-orphan")
    dates = relationship("Date", back_populates="trip", cascade="all, delete-orphan")
    collaborators = relationship("User", secondary="collaborations", back_populates="collaborations")

