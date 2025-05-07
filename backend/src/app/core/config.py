from functools import lru_cache
from dotenv import load_dotenv
from pydantic_settings import BaseSettings, SettingsConfigDict
from pydantic import Field

load_dotenv()

class Settings(BaseSettings):
    # your DB and Postgres fields
    SQLALCHEMY_DATABASE_URL: str = "postgresql://postgres:password@localhost:5432/waymark_db"
    POSTGRES_USER:          str = "postgres"
    POSTGRES_PASSWORD:      str = "password"
    POSTGRES_DB:            str = "waymark_db"
    SECRET_KEY:             str = "your_secret_here"
    JWT_ALGORITHM:          str = "RS256"

    # keep these two for JWT
    SECRET_KEY: str
    JWT_ALGORITHM: str = Field(default="HS256", alias="JWT_ALGORITHM")

    model_config = SettingsConfigDict(
        env_file=".env",
        env_file_encoding="utf-8",
        extra="ignore",
        case_sensitive=False,
        populate_by_name=True,
    )

@lru_cache
def get_settings() -> Settings:
    return Settings()

settings = get_settings()
