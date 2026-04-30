"""
Therapists routes for managing therapist information and availability
"""

from flask import Blueprint, request, jsonify
from models.models import Therapist

therapists_bp = Blueprint('therapists', __name__)

# In-memory storage (replace with database)
therapists_store = {}
therapist_counter = 0


@therapists_bp.route('/register', methods=['POST'])
def register_therapist():
    """Register a new therapist"""
    global therapist_counter
    
    data = request.get_json()
    
    try:
        therapist = Therapist(
            id=therapist_counter + 1,
            name=data.get('name'),
            email=data.get('email'),
            phone=data.get('phone'),
            specialization=data.get('specialization'),
            availability=data.get('availability', {})
        )
        
        therapist_counter += 1
        therapists_store[therapist.id] = therapist
        
        return jsonify({
            'success': True,
            'message': 'Therapist registered successfully',
            'therapist': therapist.to_dict()
        }), 201
        
    except Exception as e:
        return jsonify({
            'success': False,
            'error': str(e)
        }), 400


@therapists_bp.route('/list', methods=['GET'])
def list_therapists():
    """List all therapists"""
    specialization = request.args.get('specialization')
    
    therapists = list(therapists_store.values())
    
    if specialization:
        therapists = [t for t in therapists if t.specialization == specialization]
    
    return jsonify({
        'success': True,
        'count': len(therapists),
        'therapists': [t.to_dict() for t in therapists]
    }), 200


@therapists_bp.route('/<int:therapist_id>', methods=['GET'])
def get_therapist(therapist_id):
    """Get therapist details"""
    therapist = therapists_store.get(therapist_id)
    
    if not therapist:
        return jsonify({
            'success': False,
            'error': 'Therapist not found'
        }), 404
    
    return jsonify({
        'success': True,
        'therapist': therapist.to_dict()
    }), 200


@therapists_bp.route('/<int:therapist_id>/availability', methods=['GET'])
def get_therapist_availability(therapist_id):
    """Get therapist availability"""
    therapist = therapists_store.get(therapist_id)
    
    if not therapist:
        return jsonify({
            'success': False,
            'error': 'Therapist not found'
        }), 404
    
    return jsonify({
        'success': True,
        'therapist_id': therapist_id,
        'availability': therapist.availability
    }), 200


@therapists_bp.route('/<int:therapist_id>/availability', methods=['PUT'])
def update_therapist_availability(therapist_id):
    """Update therapist availability"""
    therapist = therapists_store.get(therapist_id)
    
    if not therapist:
        return jsonify({
            'success': False,
            'error': 'Therapist not found'
        }), 404
    
    data = request.get_json()
    therapist.availability = data.get('availability', {})
    
    return jsonify({
        'success': True,
        'message': 'Availability updated successfully',
        'therapist': therapist.to_dict()
    }), 200
