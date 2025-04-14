from fastapi import FastAPI

from app.core.database import Base, engine
from app.routes import api_router

Base.metadata.create_all(bind=engine)
from datetime import datetime, UTC
from app.core.database import Base, engine
from sqlalchemy import Column, Integer, String, DateTime, Boolean
from pydantic import BaseModel, EmailStr, Field, constr, field_validator
from app.routes.user import router as user_router
from app.routes.budget import router as budget_router


Base.metadata.create_all(bind=engine)
app = FastAPI()
app.include_router(user_router, prefix = "/auth", tags=["User"])
app.include_router(budget_router, tags=["Budget"])
app.include_router(api_router, prefix="")





# TODO Add a custom validator



# Everything above this line was taken from Ugar's first demo video