from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from .routers import auth, itineraries, trips, users
from fastapi.staticfiles import StaticFiles

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

app.mount("/media", StaticFiles(directory="src/media"), name="media")

@app.get("/")
def health_check():
    return 'Health check complete'

app.include_router(auth.router)
app.include_router(itineraries.router)
app.include_router(trips.router)
app.include_router(users.router)
