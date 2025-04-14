<<<<<<< HEAD
import uvicorn
from src import app  # src/__init__.py must define: app = FastAPI()

if __name__ == "__main__":
    uvicorn.run("src:app", host="127.0.0.1", port=8000, reload=True)
=======
from fastapi import FastAPI
from app.core.database import Base, engine
from app.routes import api_router

# 👇 Import all models to register them before table creation
from app.models import destinations, trips, itinerary, dates

# 👇 Register metadata after model imports
Base.metadata.create_all(bind=engine)

app = FastAPI()
app.include_router(api_router, prefix="")

@app.get("/")
def read_root():
    return {"Hello": "World"}
>>>>>>> 5ad872a33590a78f48a24bc9a4520c6de93b2fb2
