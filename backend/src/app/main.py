from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from .routers import auth, itineraries, trips, destinations

from .database import Base, engine

app = FastAPI()

Base.metadata.create_all(bind=engine)

app.add_middleware(
    CORSMiddleware,
    allow_origins=['http://localhost:3000'],
    allow_credentials=True,
    allow_methods=['*'],
    allow_headers=['*'],
)

@app.get("/")
def health_check():
    return 'Health check complete'

# Mount all routers under the /api prefix
from fastapi import APIRouter
api_router = APIRouter()
api_router.include_router(auth.router)
api_router.include_router(itineraries.router)
api_router.include_router(trips.router)
api_router.include_router(destinations.router)
app.include_router(api_router, prefix="/api")
