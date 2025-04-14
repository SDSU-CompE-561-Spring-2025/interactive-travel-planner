from sqlalchemy import Column, String, Float, DateTime, ForeignKey
from sqlalchemy.dialects.postgresql import UUID
from sqlalchemy.orm import relationship
from datetime import datetime
import uuid
from app.core.database import Base

class Budget(Base):
    __tablename__ = "budget"
    
    id = Column(Integer, primary_key=True, index=True)
    trip_id = Column(Integer, ForeignKey("trip.id"), nullable=False)  # Assuming you have a `trip` table
    amount = Column(Float, nullable=False)
    currency = Column(String, nullable=False)
    description = Column(String)
    category = Column(String, nullable=False)
    created_at = Column(DateTime, default=lambda: datetime.now(timezone.utc))
    updated_at = Column(DateTime, default=lambda: datetime.now(timezone.utc), onupdate=lambda: datetime.now(timezone.utc))

    trip = relationship("Trip", back_populates="budgets")  

# ADD UUID FOR ID AND TRIP_ID