from sqlalchemy import Column, Integer, String, ForeignKey, DateTime
from sqlalchemy.orm import relationship
from datetime import datetime
from app.database import Base

class Collaboration(Base):
    __tablename__ = 'collaborations'

    id = Column(Integer, primary_key=True, index=True)
    trip_id = Column(Integer, ForeignKey('trips.id'))
    user_id = Column(Integer, ForeignKey('users.id'))
    role = Column(String, nullable=False, default='viewer')
    invited_at = Column(DateTime, default=datetime.utcnow)
