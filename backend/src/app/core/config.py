from functools import lru_cache
from dotenv import load_dotenv
from pydantic_settings import BaseSettings, SettingsConfigDict

load_dotenv()

import os
print("jwt_algorithm in env?", "jwt_algorithm" in os.environ)
print("JWT_ALGORITHM in env?", "JWT_ALGORITHM" in os.environ)
print("=== ENV DUMP START ===")
for k, v in os.environ.items():
    if "jwt" in k.lower():
        print(f"{k} = {v}")
print("=== ENV DUMP END ===")

class Settings(BaseSettings):
    DATABASE_URL: str
    SECRET_KEY: str
    JWT_ALGORITHM: str

    model_config = SettingsConfigDict(
        env_file=".env",
        env_file_encoding="utf-8",
        extra="ignore"
    )

@lru_cache
def get_settings() -> Settings:
    return Settings()

settings = get_settings()
