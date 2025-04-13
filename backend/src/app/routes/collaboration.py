from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from app.schemas import CollaborationCreate, Collaboration
from app.crud import collaboration as crud_collaboration
from app.database import get_db