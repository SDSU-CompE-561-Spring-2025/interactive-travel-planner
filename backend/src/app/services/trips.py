from ..models.trips import Trip as TripModel
from ..schemas.trips import TripUpdate
from ..deps import db_dependency


def update_trip(db: db_dependency, trip_id: int, trip_data: TripUpdate):
    return TripModel.update_trip(db, trip_id, trip_data.dict(exclude_unset=True))
