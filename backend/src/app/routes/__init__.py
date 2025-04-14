from app.routes import category, user, trips, destinations, itinerary, dates, calendar

api_router = APIRouter()

api_router.include_router(user.router, prefix="/auth", tags=["User"])
api_router.include_router(category.router, prefix="/category", tags=["Category"])
api_router.include_router(trips.router, tags=["Trips"])
api_router.include_router(destinations.router, tags=["Destinations"])
api_router.include_router(calendar.router, prefix="/calendar", tags=["Calendar"])
api_router.include_router(itinerary.router, tags=["Itinerary"])
api_router.include_router(dates.router, tags=["Dates"])

app.include_router(api_router)

