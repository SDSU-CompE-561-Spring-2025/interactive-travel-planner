# backend/models/dates.py

from . import db

class Dates(db.Model):
    __tablename__ = 'dates'

    id = db.Column(db.Integer, primary_key=True)
    trip_id = db.Column(db.Integer, db.ForeignKey('destinations.id'), nullable=False, unique=True)
    start_date = db.Column(db.Date, nullable=False)
    end_date = db.Column(db.Date, nullable=False)

    destination = db.relationship('Destination', back_populates='dates', uselist=False)

    def to_dict(self):
        return {
            'id': self.id,
            'trip_id': self.trip_id,
            'start_date': self.start_date.isoformat() if self.start_date else None,
            'end_date': self.end_date.isoformat() if self.end_date else None
        }
