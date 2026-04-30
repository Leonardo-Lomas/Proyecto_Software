"""
WhatsApp integration routes for handling WhatsApp conversations and interactions
Manages appointment scheduling, rescheduling, and viewing through WhatsApp
"""

from flask import Blueprint, request, jsonify
import json
import os
from datetime import datetime
import requests
import logging

whatsapp_bp = Blueprint('whatsapp', __name__)
logger = logging.getLogger(__name__)

# WhatsApp API configuration
WHATSAPP_API_URL = "https://graph.instagram.com/v18.0"
WHATSAPP_BUSINESS_ACCOUNT_ID = os.getenv('WHATSAPP_BUSINESS_ACCOUNT_ID')
WHATSAPP_PHONE_NUMBER_ID = os.getenv('WHATSAPP_PHONE_NUMBER_ID')
WHATSAPP_ACCESS_TOKEN = os.getenv('WHATSAPP_ACCESS_TOKEN')
WEBHOOK_VERIFY_TOKEN = os.getenv('WHATSAPP_WEBHOOK_VERIFY_TOKEN')

# In-memory conversation storage (replace with database)
conversations = {}


class WhatsAppBot:
    """WhatsApp Bot for handling conversations"""
    
    MAIN_MENU = """Bienvenido a la Clínica Digital 👋
    
Por favor selecciona una opción:

1️⃣ *Agendar una cita*
2️⃣ *Ver mis citas*
3️⃣ *Reagendar cita*
4️⃣ *Cancelar cita*
5️⃣ *Información de la clínica*

Responde con el número de tu opción (1-5)"""
    
    APPOINTMENT_TYPES = """Selecciona el tipo de cita:

1. Terapia Individual
2. Evaluación Psicológica
3. Consulta Médica
4. Terapia de Pareja
5. Otro"""
    
    @staticmethod
    def get_response(message_text, phone_number, conversation_state):
        """Generate response based on user input"""
        message = message_text.strip().lower()
        
        if not conversation_state or conversation_state.get('state') == 'start':
            if message in ['hola', 'hi', '1']:
                return WhatsAppBot.MAIN_MENU, 'main_menu'
            return WhatsAppBot.MAIN_MENU, 'main_menu'
        
        state = conversation_state.get('state')
        
        if state == 'main_menu':
            if message == '1':
                return WhatsAppBot.APPOINTMENT_TYPES, 'selecting_appointment_type'
            elif message == '2':
                return "Cargando tus citas...", 'viewing_appointments'
            elif message == '3':
                return "¿Cuál cita deseas reagendar?", 'selecting_rescheduling'
            elif message == '4':
                return "¿Cuál cita deseas cancelar?", 'selecting_cancellation'
            elif message == '5':
                return "Información de la clínica:\nTeléfono: +1-800-CLINIC\nDirección: Calle Principal 123\nHorario: Lunes-Viernes 9am-6pm", 'main_menu'
            else:
                return WhatsAppBot.MAIN_MENU, 'main_menu'
        
        elif state == 'selecting_appointment_type':
            if message in ['1', '2', '3', '4', '5']:
                return "¿Qué fecha te vendría bien? (ejemplo: 2024-12-15)", 'selecting_date'
            else:
                return "Opción no válida. " + WhatsAppBot.APPOINTMENT_TYPES, 'selecting_appointment_type'
        
        elif state == 'selecting_date':
            return "¿A qué hora? (ejemplo: 14:30)", 'selecting_time'
        
        elif state == 'selecting_time':
            return "Perfecto! Tu cita ha sido agendada. Recibirás un recordatorio 24 horas antes. ¿Hay algo más en lo que pueda ayudarte?", 'main_menu'
        
        elif state == 'viewing_appointments':
            return "Aquí están tus próximas citas:\n1. Cita - Mañana a las 14:30\n2. Cita - Próxima semana a las 10:00", 'main_menu'
        
        return WhatsAppBot.MAIN_MENU, 'main_menu'


@whatsapp_bp.route('/webhook', methods=['GET'])
def webhook_verify():
    """Webhook verification for WhatsApp"""
    verify_token = request.args.get('hub.verify_token')
    challenge = request.args.get('hub.challenge')
    
    if verify_token == WEBHOOK_VERIFY_TOKEN:
        return challenge, 200
    else:
        return jsonify({'error': 'Invalid token'}), 403


@whatsapp_bp.route('/webhook', methods=['POST'])
def webhook_receive():
    """Receive and process WhatsApp messages"""
    try:
        data = request.get_json()
        
        if data['object'] == 'whatsapp_business_account':
            entry = data['entry'][0]
            changes = entry['changes'][0]
            value = changes['value']
            
            if 'messages' in value:
                message = value['messages'][0]
                phone_number = message['from']
                message_text = message['text']['body']
                
                # Get or create conversation state
                if phone_number not in conversations:
                    conversations[phone_number] = {'state': 'start', 'timestamp': datetime.now().isoformat()}
                
                conversation_state = conversations[phone_number]
                
                # Generate response
                response_text, new_state = WhatsAppBot.get_response(
                    message_text, 
                    phone_number, 
                    conversation_state
                )
                
                # Update conversation state
                conversations[phone_number]['state'] = new_state
                conversations[phone_number]['last_message'] = message_text
                conversations[phone_number]['last_response'] = response_text
                
                # Send response
                send_whatsapp_message(phone_number, response_text)
                
                logger.info(f"Processed message from {phone_number}")
        
        return jsonify({'status': 'received'}), 200
        
    except Exception as e:
        logger.error(f"Error processing webhook: {e}")
        return jsonify({'error': str(e)}), 400


def send_whatsapp_message(phone_number, message_text):
    """Send a message via WhatsApp API"""
    try:
        url = f"{WHATSAPP_API_URL}/{WHATSAPP_PHONE_NUMBER_ID}/messages"
        
        headers = {
            'Authorization': f'Bearer {WHATSAPP_ACCESS_TOKEN}',
            'Content-Type': 'application/json'
        }
        
        payload = {
            'messaging_product': 'whatsapp',
            'recipient_type': 'individual',
            'to': phone_number,
            'type': 'text',
            'text': {
                'preview_url': True,
                'body': message_text
            }
        }
        
        response = requests.post(url, json=payload, headers=headers)
        
        if response.status_code == 200:
            logger.info(f"Message sent to {phone_number}")
            return True
        else:
            logger.error(f"Failed to send message: {response.text}")
            return False
            
    except Exception as e:
        logger.error(f"Error sending WhatsApp message: {e}")
        return False


@whatsapp_bp.route('/send-message', methods=['POST'])
def send_message():
    """Send a WhatsApp message (for appointments notifications, etc.)"""
    data = request.get_json()
    
    phone_number = data.get('phone_number')
    message_text = data.get('message')
    
    if not phone_number or not message_text:
        return jsonify({'error': 'Missing phone_number or message'}), 400
    
    success = send_whatsapp_message(phone_number, message_text)
    
    return jsonify({
        'success': success,
        'phone_number': phone_number,
        'message': message_text
    }), 200 if success else 500


@whatsapp_bp.route('/conversations/<phone_number>', methods=['GET'])
def get_conversation(phone_number):
    """Get conversation history for a phone number"""
    if phone_number not in conversations:
        return jsonify({
            'error': 'No conversation found'
        }), 404
    
    return jsonify({
        'success': True,
        'phone_number': phone_number,
        'conversation': conversations[phone_number]
    }), 200


@whatsapp_bp.route('/conversations', methods=['GET'])
def list_conversations():
    """List all active conversations"""
    return jsonify({
        'success': True,
        'count': len(conversations),
        'conversations': conversations
    }), 200
