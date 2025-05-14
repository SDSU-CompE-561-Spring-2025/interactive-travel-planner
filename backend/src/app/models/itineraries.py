from sqlalchemy import Column, Integer, String, ForeignKey, DateTime
from sqlalchemy.orm import relationship
from datetime import UTC, datetime
from app.database import Base
from app.models.association import itinerary_trip_association
from fastapi import HTTPException, status
from sqlalchemy.inspection import inspect



class Itinerary(Base): #workout --> itinerary
    __tablename__ = 'itineraries'
    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey('users.id'))
    name = Column(String, index=True)
    description = Column(String, index=True)
    start_date = Column(DateTime, default=datetime.now(UTC))
    end_date = Column(DateTime, default=datetime.now(UTC))

    trips = relationship('Trip', secondary=itinerary_trip_association, back_populates='itineraries')
    locations = relationship('Location', back_populates='itinerary', cascade='all, delete-orphan')

    @classmethod
    def update_itinerary(cls, db, itinerary_id: int, data: dict):
        db_itin = db.get(cls, itinerary_id)
        if not db_itin:
            raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Itinerary not found")

        if "trips" in data:
            from app.models.trips import Trip
            trip_ids = data.pop("trips") or []
            db_itin.trips = (
                db.query(Trip)
                    .filter(Trip.id.in_(trip_ids))
                    .all()
            )

        if "locations" in data:
            from app.models.locations import Location
            # Delete existing locations
            db.query(Location).filter(Location.itinerary_id == itinerary_id).delete()
            # Add new locations
            for loc_data in data.pop("locations", []):
                location = Location(
                    itinerary_id=itinerary_id,
                    name=loc_data["name"],
                    description=loc_data.get("description"),
                    latitude=loc_data["coordinates"][0],
                    longitude=loc_data["coordinates"][1]
                )
                db.add(location)

        # 2) handle real columns
        mapper = inspect(cls)
        for field, val in data.items():
            if field in mapper.columns:
                setattr(db_itin, field, val)

        db.commit()
        db.refresh(db_itin)
        return db_itin
