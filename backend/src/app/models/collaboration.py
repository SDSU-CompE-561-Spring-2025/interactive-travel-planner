from sqlalchemy import Table, Column, ForeignKey, Integer
from app.core.database import Base

collaborations = Table(
    "collaborations", Base.metadata,
    Column("user_id", Integer, ForeignKey("users.id"), primary_key=True),
    Column("trip_id", Integer, ForeignKey("trips.id"), primary_key=True)
)
