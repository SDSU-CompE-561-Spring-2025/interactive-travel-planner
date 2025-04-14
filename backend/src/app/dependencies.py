from sqlalchemy.orm import Session
from fastapi import Depends, HTTPException, status
from core.database import SessionLocal

# Replace with auth logic
def get_current_user() -> int:
    # Simulate logged-in user ID
    return 1

def get_db() -> Session:
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()