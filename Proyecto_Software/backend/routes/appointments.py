"""
Appointments routes for managing clinic appointments
"""

from flask import Blueprint, request, jsonify
from datetime import datetime
from models.models import Appointment, AppointmentStatus

appointments_bp = Blueprint('appointments', __name__)


# In-memory storage (replace with database)
appointments_store = {}
appointment_counter = 0


@appointments_bp.route('/create', methods=['POST'])
def create_appointment():
    """Create a new appointment"""
    global appointment_counter
    
    data = request.get_json()
    
    try:
        appointment = Appointment(
            id=appointment_counter + 1,
            patient_id=data.get('patient_id'),
            therapist_id=data.get('therapist_id'),
            room_id=data.get('room_id'),
            scheduled_time=datetime.fromisoformat(data.get('scheduled_time')),
            duration=data.get('duration', 60),
            notes=data.get('notes', '')
        )
        
        appointment_counter += 1
        appointments_store[appointment.id] = appointment
        
        return jsonify({
            'success': True,
            'message': 'Appointment created successfully',
            'appointment': appointment.to_dict()
        }), 201
        
    except Exception as e:
        return jsonify({
            'success': False,
            'error': str(e)
        }), 400


@appointments_bp.route('/list', methods=['GET'])
def list_appointments():
    """List all appointments with optional filters"""
    patient_id = request.args.get('patient_id')
    therapist_id = request.args.get('therapist_id')
    status = request.args.get('status')
    
    appointments = list(appointments_store.values())
    
    if patient_id:
        appointments = [a for a in appointments if a.patient_id == int(patient_id)]
    
    if therapist_id:
        appointments = [a for a in appointments if a.therapist_id == int(therapist_id)]
    
    if status:
        appointments = [a for a in appointments if a.status == status]
    
    return jsonify({
        'success': True,
        'count': len(appointments),
        'appointments': [a.to_dict() for a in appointments]
    }), 200


@appointments_bp.route('/<int:appointment_id>', methods=['GET'])
def get_appointment(appointment_id):
    """Get appointment details"""
    appointment = appointments_store.get(appointment_id)
    
    if not appointment:
        return jsonify({
            'success': False,
            'error': 'Appointment not found'
        }), 404
    
    return jsonify({
        'success': True,
        'appointment': appointment.to_dict()
    }), 200


@appointments_bp.route('/<int:appointment_id>/reschedule', methods=['PUT'])
def reschedule_appointment(appointment_id):
    """Reschedule an existing appointment"""
    appointment = appointments_store.get(appointment_id)
    
    if not appointment:
        return jsonify({
            'success': False,
            'error': 'Appointment not found'
        }), 404
    
    data = request.get_json()
    
    try:
        old_time = appointment.scheduled_time
        appointment.scheduled_time = datetime.fromisoformat(data.get('scheduled_time'))
        appointment.status = AppointmentStatus.RESCHEDULED.value
        appointment.updated_at = datetime.now()
        
        return jsonify({
            'success': True,
            'message': 'Appointment rescheduled successfully',
            'appointment': appointment.to_dict(),
            'previous_time': old_time.isoformat()
        }), 200
        
    except Exception as e:
        return jsonify({
            'success': False,
            'error': str(e)
        }), 400


@appointments_bp.route('/<int:appointment_id>/cancel', methods=['PUT'])
def cancel_appointment(appointment_id):
    """Cancel an appointment"""
    appointment = appointments_store.get(appointment_id)
    
    if not appointment:
        return jsonify({
            'success': False,
            'error': 'Appointment not found'
        }), 404
    
    appointment.status = AppointmentStatus.CANCELLED.value
    appointment.updated_at = datetime.now()
    
    return jsonify({
        'success': True,
        'message': 'Appointment cancelled successfully',
        'appointment': appointment.to_dict()
    }), 200


@appointments_bp.route('/<int:appointment_id>/confirm', methods=['PUT'])
def confirm_appointment(appointment_id):
    """Confirm an appointment"""
    appointment = appointments_store.get(appointment_id)
    
    if not appointment:
        return jsonify({
            'success': False,
            'error': 'Appointment not found'
        }), 404
    
    appointment.status = AppointmentStatus.CONFIRMED.value
    appointment.updated_at = datetime.now()
    
    return jsonify({
        'success': True,
        'message': 'Appointment confirmed successfully',
        'appointment': appointment.to_dict()
    }), 200
