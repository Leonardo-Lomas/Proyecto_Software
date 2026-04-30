"""
Database models for the clinic management system
"""

from datetime import datetime
from enum import Enum


class AppointmentStatus(Enum):
    """Appointment status enumeration"""
    SCHEDULED = "scheduled"
    CONFIRMED = "confirmed"
    RESCHEDULED = "rescheduled"
    COMPLETED = "completed"
    CANCELLED = "cancelled"
    NO_SHOW = "no_show"


class Patient:
    """Patient model"""
    def __init__(self, id=None, name=None, phone=None, email=None, 
                 whatsapp=None, id_number=None, created_at=None):
        self.id = id
        self.name = name
        self.phone = phone
        self.email = email
        self.whatsapp = whatsapp
        self.id_number = id_number
        self.created_at = created_at or datetime.now()
        self.appointments = []
        self.medical_records = []
    
    def to_dict(self):
        """Convert to dictionary"""
        return {
            'id': self.id,
            'name': self.name,
            'phone': self.phone,
            'email': self.email,
            'whatsapp': self.whatsapp,
            'id_number': self.id_number,
            'created_at': self.created_at.isoformat()
        }


class Therapist:
    """Therapist model"""
    def __init__(self, id=None, name=None, email=None, phone=None,
                 specialization=None, availability=None):
        self.id = id
        self.name = name
        self.email = email
        self.phone = phone
        self.specialization = specialization
        self.availability = availability or {}
        self.appointments = []
    
    def to_dict(self):
        """Convert to dictionary"""
        return {
            'id': self.id,
            'name': self.name,
            'email': self.email,
            'phone': self.phone,
            'specialization': self.specialization,
            'availability': self.availability
        }


class Room:
    """Room/Space model"""
    def __init__(self, id=None, name=None, capacity=None, type=None):
        self.id = id
        self.name = name
        self.capacity = capacity
        self.type = type  # consultation, therapy, waiting, etc.
        self.appointments = []
    
    def to_dict(self):
        """Convert to dictionary"""
        return {
            'id': self.id,
            'name': self.name,
            'capacity': self.capacity,
            'type': self.type
        }


class Appointment:
    """Appointment model"""
    def __init__(self, id=None, patient_id=None, therapist_id=None, 
                 room_id=None, scheduled_time=None, duration=None,
                 status=None, notes=None, created_at=None):
        self.id = id
        self.patient_id = patient_id
        self.therapist_id = therapist_id
        self.room_id = room_id
        self.scheduled_time = scheduled_time
        self.duration = duration  # in minutes
        self.status = status or AppointmentStatus.SCHEDULED.value
        self.notes = notes
        self.created_at = created_at or datetime.now()
        self.updated_at = datetime.now()
        self.notifications_sent = []
    
    def to_dict(self):
        """Convert to dictionary"""
        return {
            'id': self.id,
            'patient_id': self.patient_id,
            'therapist_id': self.therapist_id,
            'room_id': self.room_id,
            'scheduled_time': self.scheduled_time.isoformat() if self.scheduled_time else None,
            'duration': self.duration,
            'status': self.status,
            'notes': self.notes,
            'created_at': self.created_at.isoformat(),
            'updated_at': self.updated_at.isoformat()
        }


class Notification:
    """Notification model"""
    def __init__(self, id=None, appointment_id=None, recipient=None,
                 message=None, notification_type=None, sent_at=None, status=None):
        self.id = id
        self.appointment_id = appointment_id
        self.recipient = recipient  # phone number or email
        self.message = message
        self.notification_type = notification_type  # whatsapp, email, sms
        self.sent_at = sent_at
        self.status = status or "pending"  # pending, sent, failed, read
    
    def to_dict(self):
        """Convert to dictionary"""
        return {
            'id': self.id,
            'appointment_id': self.appointment_id,
            'recipient': self.recipient,
            'message': self.message,
            'notification_type': self.notification_type,
            'sent_at': self.sent_at.isoformat() if self.sent_at else None,
            'status': self.status
        }


class WhatsAppConversation:
    """WhatsApp conversation session model"""
    def __init__(self, id=None, phone_number=None, user_state=None, 
                 context=None, created_at=None, updated_at=None):
        self.id = id
        self.phone_number = phone_number
        self.user_state = user_state  # start, selecting_option, viewing_appointment, etc.
        self.context = context or {}  # Store conversation context
        self.created_at = created_at or datetime.now()
        self.updated_at = updated_at or datetime.now()
    
    def to_dict(self):
        """Convert to dictionary"""
        return {
            'id': self.id,
            'phone_number': self.phone_number,
            'user_state': self.user_state,
            'context': self.context,
            'created_at': self.created_at.isoformat(),
            'updated_at': self.updated_at.isoformat()
        }
