import uvicorn
from src import app  # src/__init__.py must define: app = FastAPI()

if __name__ == "__main__":
    uvicorn.run("src:app", host="127.0.0.1", port=8000, reload=True)