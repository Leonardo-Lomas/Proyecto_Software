"""
Patients routes for managing patient information
"""

from flask import Blueprint, request, jsonify
from datetime import datetime
from models.models import Patient

patients_bp = Blueprint('patients', __name__)

# In-memory storage (replace with database)
patients_store = {}
patient_counter = 0


@patients_bp.route('/register', methods=['POST'])
def register_patient():
    """Register a new patient"""
    global patient_counter
    
    data = request.get_json()
    
    try:
        patient = Patient(
            id=patient_counter + 1,
            name=data.get('name'),
            phone=data.get('phone'),
            email=data.get('email'),
            whatsapp=data.get('whatsapp'),
            id_number=data.get('id_number')
        )
        
        patient_counter += 1
        patients_store[patient.id] = patient
        
        return jsonify({
            'success': True,
            'message': 'Patient registered successfully',
            'patient': patient.to_dict()
        }), 201
        
    except Exception as e:
        return jsonify({
            'success': False,
            'error': str(e)
        }), 400


@patients_bp.route('/list', methods=['GET'])
def list_patients():
    """List all patients"""
    patients = list(patients_store.values())
    
    return jsonify({
        'success': True,
        'count': len(patients),
        'patients': [p.to_dict() for p in patients]
    }), 200


@patients_bp.route('/<int:patient_id>', methods=['GET'])
def get_patient(patient_id):
    """Get patient details"""
    patient = patients_store.get(patient_id)
    
    if not patient:
        return jsonify({
            'success': False,
            'error': 'Patient not found'
        }), 404
    
    return jsonify({
        'success': True,
        'patient': patient.to_dict()
    }), 200


@patients_bp.route('/<int:patient_id>/update', methods=['PUT'])
def update_patient(patient_id):
    """Update patient information"""
    patient = patients_store.get(patient_id)
    
    if not patient:
        return jsonify({
            'success': False,
            'error': 'Patient not found'
        }), 404
    
    data = request.get_json()
    
    if 'name' in data:
        patient.name = data['name']
    if 'phone' in data:
        patient.phone = data['phone']
    if 'email' in data:
        patient.email = data['email']
    if 'whatsapp' in data:
        patient.whatsapp = data['whatsapp']
    
    return jsonify({
        'success': True,
        'message': 'Patient updated successfully',
        'patient': patient.to_dict()
    }), 200


@patients_bp.route('/<int:patient_id>/appointments', methods=['GET'])
def get_patient_appointments(patient_id):
    """Get all appointments for a patient"""
    patient = patients_store.get(patient_id)
    
    if not patient:
        return jsonify({
            'success': False,
            'error': 'Patient not found'
        }), 404
    
    # This would fetch appointments from appointments store
    # Simplified for now
    return jsonify({
        'success': True,
        'patient_id': patient_id,
        'appointments': []
    }), 200
