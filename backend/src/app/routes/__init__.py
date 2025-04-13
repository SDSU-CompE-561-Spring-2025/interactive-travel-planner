from fastapi import APIRouter

from app.routes import category, user, trips, destinations, itinerary

api_router = APIRouter()
api_router.include_router(user.router, prefix="/auth", tags=["User"])
api_router.include_router(category.router, prefix="/category", tags=["Category"])
api_router.include_router(trips.router, tags=["Trips"])
api_router.include_router(destinations.router, tags=["Destinations"])
api_router.include_router(itineray.router, tags=["Itinerary"])
