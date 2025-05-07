from app.core.config import settings
from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker, declarative_base

# use the DATABASE_URL field that actually exists in Settings
SQLALCHEMY_DATABASE_URL = settings.SQLALCHEMY_DATABASE_URL

engine = create_engine(SQLALCHEMY_DATABASE_URL)


SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)
Base = declarative_base()
