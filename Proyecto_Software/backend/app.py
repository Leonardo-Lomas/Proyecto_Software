"""
Clinic Appointment Management System - Backend API
Main Flask application for managing appointments, patients, therapists, and rooms.
Supports both Web and WhatsApp interfaces.
"""

from flask import Flask, request, jsonify
from flask_cors import CORS
from datetime import datetime
import os
import logging
from dotenv import load_dotenv

# Load environment variables
load_dotenv()

# Initialize Flask app
app = Flask(__name__)
CORS(app)

# Configure logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

# Configuration
app.config['SECRET_KEY'] = os.getenv('SECRET_KEY', 'dev-secret-key-change-in-production')
app.config['DATABASE_URL'] = os.getenv('DATABASE_URL', 'sqlite:///clinic.db')

# Import blueprints
from routes.appointments import appointments_bp
from routes.patients import patients_bp
from routes.therapists import therapists_bp
from routes.rooms import rooms_bp
from routes.whatsapp import whatsapp_bp
from routes.notifications import notifications_bp

# Register blueprints
app.register_blueprint(appointments_bp, url_prefix='/api/appointments')
app.register_blueprint(patients_bp, url_prefix='/api/patients')
app.register_blueprint(therapists_bp, url_prefix='/api/therapists')
app.register_blueprint(rooms_bp, url_prefix='/api/rooms')
app.register_blueprint(whatsapp_bp, url_prefix='/api/whatsapp')
app.register_blueprint(notifications_bp, url_prefix='/api/notifications')


@app.route('/api/health', methods=['GET'])
def health_check():
    """Health check endpoint"""
    return jsonify({
        'status': 'healthy',
        'timestamp': datetime.now().isoformat(),
        'message': 'Clinic Appointment Management System is running'
    }), 200


@app.route('/', methods=['GET'])
def index():
    """Root endpoint"""
    return jsonify({
        'name': 'Clinic Appointment Management System',
        'version': '1.0.0',
        'description': 'API for managing clinic appointments with WhatsApp integration',
        'documentation': '/api/docs'
    }), 200


@app.errorhandler(404)
def not_found(error):
    """Handle 404 errors"""
    return jsonify({
        'error': 'Not Found',
        'message': 'The requested resource does not exist',
        'status': 404
    }), 404


@app.errorhandler(500)
def server_error(error):
    """Handle 500 errors"""
    logger.error(f'Server error: {error}')
    return jsonify({
        'error': 'Internal Server Error',
        'message': 'An unexpected error occurred',
        'status': 500
    }), 500


if __name__ == '__main__':
    # Development server - change to production wsgi server in production
    app.run(
        host=os.getenv('HOST', '0.0.0.0'),
        port=int(os.getenv('PORT', 5000)),
        debug=os.getenv('DEBUG', 'True') == 'True'
    )
