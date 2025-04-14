from datetime import UTC, datetime
import enum

from sqlalchemy import Column, DateTime, Enum, ForeignKey, Integer, String
from sqlalchemy.orm import relationship

from app.core.database import Base



class Trips(Base):
    __tablename__ = "trips"

    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id"))
    title = Column(String)
    description = Column(String)

    start_date = Column(DateTime, default=datetime.now(UTC))
    end_date = Column(DateTime, default=datetime.now(UTC))
    created_at = Column(DateTime, default=datetime.now(UTC))
    updated_at = Column(DateTime, default=datetime.now(UTC), onupdate=datetime.now(UTC))

    user = relationship("User", back_populates="trips")
    destinations = relationship("Destinations", back_populates="trip", cascade="all, delete")
    budgets = relationship("Budget", back_populates="trip", cascade="all, delete-orphan")

