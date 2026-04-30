"""
Rooms routes for managing clinic rooms and spaces
"""

from flask import Blueprint, request, jsonify
from models.models import Room

rooms_bp = Blueprint('rooms', __name__)

# In-memory storage (replace with database)
rooms_store = {}
room_counter = 0


@rooms_bp.route('/create', methods=['POST'])
def create_room():
    """Create a new room"""
    global room_counter
    
    data = request.get_json()
    
    try:
        room = Room(
            id=room_counter + 1,
            name=data.get('name'),
            capacity=data.get('capacity'),
            type=data.get('type')
        )
        
        room_counter += 1
        rooms_store[room.id] = room
        
        return jsonify({
            'success': True,
            'message': 'Room created successfully',
            'room': room.to_dict()
        }), 201
        
    except Exception as e:
        return jsonify({
            'success': False,
            'error': str(e)
        }), 400


@rooms_bp.route('/list', methods=['GET'])
def list_rooms():
    """List all rooms"""
    room_type = request.args.get('type')
    
    rooms = list(rooms_store.values())
    
    if room_type:
        rooms = [r for r in rooms if r.type == room_type]
    
    return jsonify({
        'success': True,
        'count': len(rooms),
        'rooms': [r.to_dict() for r in rooms]
    }), 200


@rooms_bp.route('/<int:room_id>', methods=['GET'])
def get_room(room_id):
    """Get room details"""
    room = rooms_store.get(room_id)
    
    if not room:
        return jsonify({
            'success': False,
            'error': 'Room not found'
        }), 404
    
    return jsonify({
        'success': True,
        'room': room.to_dict()
    }), 200


@rooms_bp.route('/<int:room_id>/update', methods=['PUT'])
def update_room(room_id):
    """Update room information"""
    room = rooms_store.get(room_id)
    
    if not room:
        return jsonify({
            'success': False,
            'error': 'Room not found'
        }), 404
    
    data = request.get_json()
    
    if 'name' in data:
        room.name = data['name']
    if 'capacity' in data:
        room.capacity = data['capacity']
    if 'type' in data:
        room.type = data['type']
    
    return jsonify({
        'success': True,
        'message': 'Room updated successfully',
        'room': room.to_dict()
    }), 200
