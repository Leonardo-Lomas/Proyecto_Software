"""
Database initialization and migration scripts
"""

import os
import sqlite3
from datetime import datetime

# Database file path
DB_PATH = os.path.join(os.path.dirname(__file__), 'clinic.db')


def init_database():
    """Initialize the database with required tables"""
    conn = sqlite3.connect(DB_PATH)
    cursor = conn.cursor()

    # Patients table
    cursor.execute('''
        CREATE TABLE IF NOT EXISTS patients (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            name TEXT NOT NULL,
            phone TEXT,
            email TEXT UNIQUE,
            whatsapp TEXT,
            id_number TEXT UNIQUE,
            created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
            updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        )
    ''')

    # Therapists table
    cursor.execute('''
        CREATE TABLE IF NOT EXISTS therapists (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            name TEXT NOT NULL,
            email TEXT UNIQUE,
            phone TEXT,
            specialization TEXT,
            availability TEXT,  -- JSON format
            created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
            updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        )
    ''')

    # Rooms table
    cursor.execute('''
        CREATE TABLE IF NOT EXISTS rooms (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            name TEXT NOT NULL,
            capacity INTEGER,
            type TEXT,
            created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
            updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        )
    ''')

    # Appointments table
    cursor.execute('''
        CREATE TABLE IF NOT EXISTS appointments (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            patient_id INTEGER NOT NULL,
            therapist_id INTEGER NOT NULL,
            room_id INTEGER,
            scheduled_time TIMESTAMP NOT NULL,
            duration INTEGER DEFAULT 60,
            status TEXT DEFAULT 'scheduled',
            notes TEXT,
            created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
            updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
            FOREIGN KEY(patient_id) REFERENCES patients(id),
            FOREIGN KEY(therapist_id) REFERENCES therapists(id),
            FOREIGN KEY(room_id) REFERENCES rooms(id)
        )
    ''')

    # Notifications table
    cursor.execute('''
        CREATE TABLE IF NOT EXISTS notifications (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            appointment_id INTEGER NOT NULL,
            recipient TEXT NOT NULL,
            message TEXT,
            notification_type TEXT,  -- whatsapp, email, sms
            status TEXT DEFAULT 'pending',  -- pending, sent, failed, read
            sent_at TIMESTAMP,
            created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
            FOREIGN KEY(appointment_id) REFERENCES appointments(id)
        )
    ''')

    # WhatsApp conversations table
    cursor.execute('''
        CREATE TABLE IF NOT EXISTS whatsapp_conversations (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            phone_number TEXT UNIQUE NOT NULL,
            patient_id INTEGER,
            user_state TEXT,  -- current conversation state
            context TEXT,  -- JSON format
            created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
            updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
            FOREIGN KEY(patient_id) REFERENCES patients(id)
        )
    ''')

    # Create indexes for better performance
    cursor.execute('CREATE INDEX IF NOT EXISTS idx_appointments_patient ON appointments(patient_id)')
    cursor.execute('CREATE INDEX IF NOT EXISTS idx_appointments_therapist ON appointments(therapist_id)')
    cursor.execute('CREATE INDEX IF NOT EXISTS idx_appointments_status ON appointments(status)')
    cursor.execute('CREATE INDEX IF NOT EXISTS idx_appointments_scheduled_time ON appointments(scheduled_time)')
    cursor.execute('CREATE INDEX IF NOT EXISTS idx_notifications_appointment ON notifications(appointment_id)')
    cursor.execute('CREATE INDEX IF NOT EXISTS idx_whatsapp_phone ON whatsapp_conversations(phone_number)')

    conn.commit()
    conn.close()

    print("✓ Database initialized successfully!")


def seed_sample_data():
    """Seed the database with sample data for testing"""
    conn = sqlite3.connect(DB_PATH)
    cursor = conn.cursor()

    # Sample therapists
    therapists = [
        ('Dr. Juan García', 'juan@clinica.com', '555-0101', 'Psicología Clínica', '{"monday": ["09:00-12:00", "14:00-18:00"]}'),
        ('Dra. María López', 'maria@clinica.com', '555-0102', 'Terapia Familiar', '{"tuesday": ["10:00-13:00", "15:00-19:00"]}'),
        ('Lic. Carlos Mendez', 'carlos@clinica.com', '555-0103', 'Psicología Deportiva', '{"wednesday": ["08:00-12:00"]}'),
    ]

    for therapist in therapists:
        try:
            cursor.execute('''
                INSERT INTO therapists (name, email, phone, specialization, availability)
                VALUES (?, ?, ?, ?, ?)
            ''', therapist)
        except sqlite3.IntegrityError:
            pass  # Skip if already exists

    # Sample rooms
    rooms = [
        ('Sala 1 - Consultorio', 2, 'consultation'),
        ('Sala 2 - Terapia Individual', 1, 'therapy'),
        ('Sala 3 - Terapia de Grupo', 8, 'group_therapy'),
        ('Sala de Espera', 10, 'waiting'),
    ]

    for room in rooms:
        try:
            cursor.execute('''
                INSERT INTO rooms (name, capacity, type)
                VALUES (?, ?, ?)
            ''', room)
        except sqlite3.IntegrityError:
            pass

    conn.commit()
    conn.close()

    print("✓ Sample data seeded successfully!")


def drop_all_tables():
    """Drop all tables (use with caution!)"""
    conn = sqlite3.connect(DB_PATH)
    cursor = conn.cursor()

    tables = [
        'notifications',
        'whatsapp_conversations',
        'appointments',
        'rooms',
        'therapists',
        'patients'
    ]

    for table in tables:
        cursor.execute(f'DROP TABLE IF EXISTS {table}')

    conn.commit()
    conn.close()

    print("✓ All tables dropped!")


if __name__ == '__main__':
    import sys

    if len(sys.argv) > 1:
        command = sys.argv[1]
        if command == 'init':
            init_database()
        elif command == 'seed':
            seed_sample_data()
        elif command == 'reset':
            drop_all_tables()
            init_database()
            seed_sample_data()
        else:
            print(f"Unknown command: {command}")
            print("Available commands: init, seed, reset")
    else:
        # Default: just initialize
        init_database()
