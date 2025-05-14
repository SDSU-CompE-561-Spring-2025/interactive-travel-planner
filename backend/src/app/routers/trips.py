from pydantic import BaseModel
from typing import List, Optional
from fastapi import APIRouter, HTTPException, UploadFile, File, Form, Depends, Body
from sqlalchemy.orm import joinedload
from app.models.trips import Trip
from app.models.itineraries import Itinerary
from app.deps import db_dependency, user_dependency
from app.schemas.trips import TripCreate, TripUpdate, TripOut
import os
from uuid import uuid4
from fastapi.responses import FileResponse
from app.services.trips import update_trip as _update_trip
from app.models.user import User

router = APIRouter(
    prefix='/trips',
    tags=['trips']
)


@router.get("/")
def get_trips(db: db_dependency, user: user_dependency):
    user_id = user.get('id')
    # Owned trips
    owned_trips = db.query(Trip).options(joinedload(Trip.itineraries), joinedload(Trip.collaborators)).filter(Trip.user_id == user_id).all()
    # Collaborating trips (not owned)
    collab_trips = db.query(Trip).options(joinedload(Trip.itineraries), joinedload(Trip.collaborators)).filter(Trip.collaborators.any(id=user_id), Trip.user_id != user_id).all()
    def trip_to_dict(trip, is_owner):
        d = {
            "id": trip.id,
            "name": trip.name,
            "description": trip.description,
            "start_date": trip.start_date.isoformat() if trip.start_date else None,
            "end_date": trip.end_date.isoformat() if trip.end_date else None,
            "itineraries": [
                {
                    "id": it.id,
                    "name": it.name,
                    "description": it.description,
                    "start_date": it.start_date.isoformat() if it.start_date else None,
                    "end_date": it.end_date.isoformat() if it.end_date else None
                } for it in trip.itineraries
            ],
            "is_owner": is_owner,
            "collaborators": [
                {"id": u.id, "username": u.username, "email": u.email} for u in trip.collaborators
            ],
            "color": trip.color,
            "image_url": trip.image_url,
            "latitude": trip.latitude,
            "longitude": trip.longitude,
        }
        owner = db.query(User).filter(User.id == trip.user_id).first()
        d["owner_name"] = owner.username if owner else None
        d["owner_email"] = owner.email if owner else None
        return d
    result = [trip_to_dict(t, True) for t in owned_trips] + [trip_to_dict(t, False) for t in collab_trips]
    return result


@router.get("/{trip_id}")
def get_trip(trip_id: int, db: db_dependency, user: user_dependency):
    trip = db.query(Trip).options(joinedload(Trip.itineraries)).filter(Trip.id == trip_id, Trip.user_id == user.get('id')).first()
    if not trip:
        raise HTTPException(status_code=404, detail="Trip not found")
    return trip


@router.post("/")
def create_trip(trip: TripCreate, db: db_dependency, user: user_dependency):
    from datetime import datetime
    db_trip = Trip(
        name=trip.name,
        description=trip.description,
        location=trip.location,
        budget=trip.budget,
        user_id=user.get('id'),
        start_date=trip.start_date if isinstance(trip.start_date, datetime) else datetime.fromisoformat(trip.start_date),
        end_date=trip.end_date if isinstance(trip.end_date, datetime) else datetime.fromisoformat(trip.end_date),
    )
    for itinerary_id in trip.itineraries:
        itinerary = db.query(Itinerary).filter(Itinerary.id == itinerary_id).first()
        if itinerary:
            db_trip.itineraries.append(itinerary)
    db.add(db_trip)
    db.commit()
    db.refresh(db_trip)
    return db_trip

@router.put("/")
def update_trip(
    db: db_dependency,
    trip_id: int = Form(...),
    name: str = Form(...),
    description: str = Form(None),
    start_date: str = Form(...),
    end_date: str = Form(...),
    itineraries: str = Form("[]"),
    color: str = Form(None),
    image: UploadFile = File(None)
):
    import json
    from datetime import datetime
    # Validate and save image if provided
    image_url = None
    if image:
        if image.content_type not in ["image/jpeg", "image/png"]:
            raise HTTPException(status_code=400, detail="Image must be JPEG or PNG")
        ext = ".jpg" if image.content_type == "image/jpeg" else ".png"
        filename = f"{uuid4()}{ext}"
        media_dir = os.path.join(os.path.dirname(__file__), "../../media/trip_images")
        os.makedirs(media_dir, exist_ok=True)
        file_path = os.path.join(media_dir, filename)
        with open(file_path, "wb") as f:
            f.write(image.file.read())
        image_url = f"/media/trip_images/{filename}"
    # Parse itineraries
    try:
        itineraries_list = json.loads(itineraries)
    except Exception:
        itineraries_list = []
    trip_data = {
        "name": name,
        "description": description,
        "start_date": datetime.fromisoformat(start_date),
        "end_date": datetime.fromisoformat(end_date),
        "itineraries": itineraries_list,
        "color": color
    }
    if image_url:
        trip_data["image_url"] = image_url
    db_trip = _update_trip(db, trip_id, trip_data)
    if not db_trip:
        raise HTTPException(status_code=404, detail="Trip not found")
    return db_trip

@router.delete('/')
def delete_trip(db: db_dependency, user: user_dependency, trip_id: int):
    db_trip = db.query(Trip).filter(Trip.id == trip_id).first()
    if db_trip:
        db.delete(db_trip)
        db.commit()
    return db_trip

@router.post("/{trip_id}/collaborators")
def add_collaborator(trip_id: int, db: db_dependency, user: user_dependency, body: dict = Body(...)):
    user_id = body.get('user_id')
    if not user_id:
        raise HTTPException(status_code=400, detail="user_id is required")
    trip = db.query(Trip).filter(Trip.id == trip_id, Trip.user_id == user.get('id')).first()
    if not trip:
        raise HTTPException(status_code=404, detail="Trip not found or not owned by you")
    collaborator = db.query(Itinerary.__table__.metadata.tables['users']).filter_by(id=user_id).first()
    if not collaborator:
        raise HTTPException(status_code=404, detail="User not found")
    if any(u.id == user_id for u in trip.collaborators):
        raise HTTPException(status_code=400, detail="User is already a collaborator")
    trip.collaborators.append(collaborator)
    db.commit()
    return {"message": "Collaborator added"}

@router.delete("/{trip_id}/collaborators/{collaborator_id}")
def remove_collaborator(trip_id: int, collaborator_id: int, db: db_dependency = None, user: user_dependency = None):
    trip = db.query(Trip).filter(Trip.id == trip_id).first()
    if not trip:
        raise HTTPException(status_code=404, detail="Trip not found")
    # Only allow if user is owner or collaborator
    if user.get('id') != trip.user_id and user.get('id') not in [u.id for u in trip.collaborators]:
        raise HTTPException(status_code=403, detail="Not authorized")
    collaborator = db.query(User).filter(User.id == collaborator_id).first()
    if not collaborator or collaborator not in trip.collaborators:
        raise HTTPException(status_code=404, detail="Collaborator not found")
    trip.collaborators.remove(collaborator)
    db.commit()
    db.refresh(trip)
    return {"detail": "Collaborator removed"}

@router.get("/{trip_id}/collaborators/")
def list_collaborators(trip_id: int, db: db_dependency = None, user: user_dependency = None):
    trip = db.query(Trip).filter(Trip.id == trip_id).first()
    if not trip:
        raise HTTPException(status_code=404, detail="Trip not found")
    # Only allow if user is owner or collaborator
    if user.get('id') != trip.user_id and user.get('id') not in [u.id for u in trip.collaborators]:
        raise HTTPException(status_code=403, detail="Not authorized")
    return [{"id": u.id, "email": u.email, "username": u.username} for u in trip.collaborators]

@router.get("/users/search")
def search_users(query: str, db: db_dependency = None, user: user_dependency = None):
    if not query or len(query) < 2:
        return []
    users = db.query(User).filter(
        (User.username.ilike(f"%{query}%")) | (User.email.ilike(f"%{query}%"))
    ).all()
    return [{"id": u.id, "username": u.username, "email": u.email} for u in users]
