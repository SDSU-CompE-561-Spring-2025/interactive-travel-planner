from flask import Blueprint, request, jsonify
from models import db
from models.itinerary import Itinerary
from datetime import datetime

itinerary_bp = Blueprint('itinerary', __name__, url_prefix='/itineraries')

@itinerary_bp.route('/', methods=['GET'])
def get_all_itineraries():
    trip_id = request.args.get('trip_id')
    if trip_id:
        itineraries = Itinerary.query.filter_by(trip_id=trip_id).all()
    else:
        itineraries = Itinerary.query.all()
    return jsonify([i.to_dict() for i in itineraries]), 200

@itinerary_bp.route('/<int:id>', methods=['GET'])
def get_itinerary(id):
    itinerary = Itinerary.query.get_or_404(id)
    return jsonify(itinerary.to_dict()), 200

@itinerary_bp.route('/', methods=['POST'])
def create_itinerary():
    data = request.get_json()
    try:
        itinerary = Itinerary(
            trip_id=data['trip_id'],
            name=data['name'],
            time=datetime.fromisoformat(data['time']),
            description=data.get('description'),
            location=data.get('location')
        )
        db.session.add(itinerary)
        db.session.commit()
        return jsonify(itinerary.to_dict()), 201
    except Exception as e:
        db.session.rollback()
        return jsonify({'error': str(e)}), 400

@itinerary_bp.route('/<int:id>', methods=['PUT'])
def update_itinerary(id):
    itinerary = Itinerary.query.get_or_404(id)
    data = request.get_json()

    if 'name' in data:
        itinerary.name = data['name']
    if 'time' in data:
        itinerary.time = datetime.fromisoformat(data['time'])
    if 'description' in data:
        itinerary.description = data['description']
    if 'location' in data:
        itinerary.location = data['location']

    db.session.commit()
    return jsonify(itinerary.to_dict()), 200

@itinerary_bp.route('/<int:id>', methods=['DELETE'])
def delete_itinerary(id):
    itinerary = Itinerary.query.get_or_404(id)
    db.session.delete(itinerary)
    db.session.commit()
    return jsonify({'message': 'Itinerary item deleted'}), 200
