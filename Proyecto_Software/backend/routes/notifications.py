"""
Notifications routes for managing notifications
"""

from flask import Blueprint, request, jsonify
from datetime import datetime
from models.models import Notification

notifications_bp = Blueprint('notifications', __name__)

# In-memory storage (replace with database)
notifications_store = {}
notification_counter = 0


@notifications_bp.route('/send', methods=['POST'])
def send_notification():
    """Send a notification (WhatsApp, Email, SMS)"""
    global notification_counter
    
    data = request.get_json()
    
    try:
        notification = Notification(
            id=notification_counter + 1,
            appointment_id=data.get('appointment_id'),
            recipient=data.get('recipient'),
            message=data.get('message'),
            notification_type=data.get('notification_type', 'whatsapp'),
            status='sent'
        )
        
        notification.sent_at = datetime.now()
        notification_counter += 1
        notifications_store[notification.id] = notification
        
        return jsonify({
            'success': True,
            'message': 'Notification sent successfully',
            'notification': notification.to_dict()
        }), 201
        
    except Exception as e:
        return jsonify({
            'success': False,
            'error': str(e)
        }), 400


@notifications_bp.route('/list', methods=['GET'])
def list_notifications():
    """List notifications with optional filters"""
    appointment_id = request.args.get('appointment_id')
    notification_type = request.args.get('type')
    status = request.args.get('status')
    
    notifications = list(notifications_store.values())
    
    if appointment_id:
        notifications = [n for n in notifications if n.appointment_id == int(appointment_id)]
    
    if notification_type:
        notifications = [n for n in notifications if n.notification_type == notification_type]
    
    if status:
        notifications = [n for n in notifications if n.status == status]
    
    return jsonify({
        'success': True,
        'count': len(notifications),
        'notifications': [n.to_dict() for n in notifications]
    }), 200


@notifications_bp.route('/schedule-reminder/<int:appointment_id>', methods=['POST'])
def schedule_reminder(appointment_id):
    """Schedule an appointment reminder"""
    data = request.get_json()
    
    return jsonify({
        'success': True,
        'message': f'Reminder scheduled for appointment {appointment_id}',
        'appointment_id': appointment_id,
        'reminder_time': data.get('reminder_time')
    }), 201
