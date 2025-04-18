from fastapi import APIRouter


from app.routes import user, trips, destinations, calendar_event, itinerary, dates, budget, collaborators

api_router = APIRouter()

api_router.include_router(user.router, prefix="/auth", tags=["User"])
api_router.include_router(trips.router, tags=["Trips"])
api_router.include_router(destinations.router, tags=["Destinations"])
api_router.include_router(calendar_event.router, tags=["Calendar Events"])
api_router.include_router(itinerary.router, tags=["Itinerary"])
api_router.include_router(dates.router, tags=["Dates"])
api_router.include_router(budget.router, tags=["Budget"])
#api_router.include_router(collaborators.router, tags=["Collaborators"])
