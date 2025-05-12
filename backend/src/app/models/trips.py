from sqlalchemy import Column, Integer, String, ForeignKey, DateTime
from datetime import UTC, datetime
from sqlalchemy.orm import relationship
from app.database import Base
from app.models.association import itinerary_trip_association
from fastapi import HTTPException, status
from app.deps import db_dependency
from sqlalchemy.inspection import inspect






class Trip(Base): # routines --> trips
    __tablename__ = 'trips'
    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey('users.id'))
    name = Column(String, index=True)
    description = Column(String, index=True)
    start_date = Column(DateTime, default=datetime.now(UTC))
    end_date = Column(DateTime, default=datetime.now(UTC))

    itineraries = relationship('Itinerary', secondary=itinerary_trip_association, back_populates='trips')

    @classmethod
    def update_trip(cls, db, trip_id, trip_data):
        db_trip = db.get(cls, trip_id)
        if not db_trip:
            raise HTTPException(404, "Not found")

        # 1) handle relationship
        if "itineraries" in trip_data:
            from app.models.itineraries import Itinerary
            ids = trip_data.pop("itineraries")
            db_trip.itineraries = (
                db.query(Itinerary)
                    .filter(Itinerary.id.in_(ids))
                    .all()
            )


        # 2) handle real columns only
        mapper = inspect(cls)
        for field, value in trip_data.items():
            if field in mapper.columns:
                setattr(db_trip, field, value)

        db.commit()
        db.refresh(db_trip)
        return db_trip
