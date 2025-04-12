from . import db

class Itinerary(db.Model):
    __tablename__ = 'itineraries'

    id = db.Column(db.Integer, primary_key=True)
    trip_id = db.Column(db.Integer, db.ForeignKey('destinations.id'), nullable=False)
    name = db.Column(db.String(100), nullable=False)
    time = db.Column(db.DateTime, nullable=False)
    description = db.Column(db.String(255))
    location = db.Column(db.String(100))

    destination = db.relationship('Destination', back_populates='itineraries')

    def to_dict(self):
        return {
            'id': self.id,
            'trip_id': self.trip_id,
            'name': self.name,
            'time': self.time.isoformat() if self.time else None,
            'description': self.description,
            'location': self.location
        }
