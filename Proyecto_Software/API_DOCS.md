# Documentación de API - Clínica Digital

## Base URL
```
http://localhost:5000/api
```

## Autenticación
Por ahora, todos los endpoints son públicos. En producción, implementar JWT.

---

## 📅 Appointments (Citas)

### Crear Cita
```http
POST /appointments/create
Content-Type: application/json

{
  "patient_id": 1,
  "therapist_id": 2,
  "room_id": 1,
  "scheduled_time": "2024-05-15T14:30:00",
  "duration": 60,
  "notes": "Cita de seguimiento"
}
```

**Response (201):**
```json
{
  "success": true,
  "message": "Appointment created successfully",
  "appointment": {
    "id": 1,
    "patient_id": 1,
    "therapist_id": 2,
    "room_id": 1,
    "scheduled_time": "2024-05-15T14:30:00",
    "duration": 60,
    "status": "scheduled",
    "notes": "Cita de seguimiento",
    "created_at": "2024-04-29T10:30:00"
  }
}
```

### Listar Citas
```http
GET /appointments/list?patient_id=1&status=scheduled
```

**Query Parameters:**
- `patient_id` (optional): Filtrar por paciente
- `therapist_id` (optional): Filtrar por terapeuta
- `status` (optional): scheduled, confirmed, completed, cancelled

### Obtener Cita
```http
GET /appointments/1
```

### Reagendar Cita
```http
PUT /appointments/1/reschedule
Content-Type: application/json

{
  "scheduled_time": "2024-05-20T15:00:00"
}
```

### Cancelar Cita
```http
PUT /appointments/1/cancel
```

### Confirmar Cita
```http
PUT /appointments/1/confirm
```

---

## 👥 Patients (Pacientes)

### Registrar Paciente
```http
POST /patients/register
Content-Type: application/json

{
  "name": "Juan García",
  "phone": "555-0101",
  "email": "juan@example.com",
  "whatsapp": "+1-555-0101",
  "id_number": "12345678"
}
```

### Listar Pacientes
```http
GET /patients/list
```

### Obtener Paciente
```http
GET /patients/1
```

### Actualizar Paciente
```http
PUT /patients/1/update
Content-Type: application/json

{
  "name": "Juan García López",
  "phone": "555-0102",
  "email": "juan.garcia@example.com"
}
```

### Obtener Citas del Paciente
```http
GET /patients/1/appointments
```

---

## 👨‍⚕️ Therapists (Terapeutas)

### Registrar Terapeuta
```http
POST /therapists/register
Content-Type: application/json

{
  "name": "Dr. Juan García",
  "email": "juan.garcia@clinica.com",
  "phone": "555-0101",
  "specialization": "Psicología Clínica",
  "availability": {
    "monday": ["09:00-12:00", "14:00-18:00"],
    "tuesday": ["09:00-12:00", "14:00-18:00"]
  }
}
```

### Listar Terapeutas
```http
GET /therapists/list?specialization=Psicología%20Clínica
```

### Obtener Terapeuta
```http
GET /therapists/1
```

### Obtener Disponibilidad
```http
GET /therapists/1/availability
```

### Actualizar Disponibilidad
```http
PUT /therapists/1/availability
Content-Type: application/json

{
  "availability": {
    "monday": ["10:00-13:00", "15:00-19:00"],
    "wednesday": ["09:00-12:00"]
  }
}
```

---

## 🚪 Rooms (Salas)

### Crear Sala
```http
POST /rooms/create
Content-Type: application/json

{
  "name": "Sala 1 - Consultorio",
  "capacity": 2,
  "type": "consultation"
}
```

### Listar Salas
```http
GET /rooms/list?type=consultation
```

### Obtener Sala
```http
GET /rooms/1
```

### Actualizar Sala
```http
PUT /rooms/1/update
Content-Type: application/json

{
  "name": "Consultorio Principal",
  "capacity": 3
}
```

---

## 💬 WhatsApp

### Webhook Verification
```http
GET /whatsapp/webhook?hub.verify_token=TOKEN&hub.challenge=CHALLENGE
```

### Webhook para Recibir Mensajes
```http
POST /whatsapp/webhook
Content-Type: application/json

{
  "object": "whatsapp_business_account",
  "entry": [{
    "changes": [{
      "value": {
        "messages": [{
          "from": "1234567890",
          "type": "text",
          "text": {
            "body": "Hola, quisiera agendar una cita"
          }
        }]
      }
    }]
  }]
}
```

### Enviar Mensaje
```http
POST /whatsapp/send-message
Content-Type: application/json

{
  "phone_number": "1234567890",
  "message": "Hola, tu cita ha sido confirmada para mañana a las 14:30"
}
```

### Listar Conversaciones
```http
GET /whatsapp/conversations
```

### Obtener Conversación
```http
GET /whatsapp/conversations/1234567890
```

---

## 🔔 Notifications (Notificaciones)

### Enviar Notificación
```http
POST /notifications/send
Content-Type: application/json

{
  "appointment_id": 1,
  "recipient": "1234567890",
  "message": "Recordatorio: Tu cita es mañana a las 14:30",
  "notification_type": "whatsapp"
}
```

### Listar Notificaciones
```http
GET /notifications/list?appointment_id=1&type=whatsapp&status=sent
```

### Programar Recordatorio
```http
POST /notifications/schedule-reminder/1
Content-Type: application/json

{
  "reminder_time": "2024-05-15T14:00:00"
}
```

---

## ✅ Health Check

### Verificar Estado
```http
GET /health
```

**Response (200):**
```json
{
  "status": "healthy",
  "timestamp": "2024-04-29T10:30:00",
  "message": "Clinic Appointment Management System is running"
}
```

---

## Códigos de Error

| Código | Descripción |
|--------|-------------|
| 200 | OK - Solicitud exitosa |
| 201 | Created - Recurso creado |
| 400 | Bad Request - Datos inválidos |
| 404 | Not Found - Recurso no encontrado |
| 500 | Internal Server Error - Error del servidor |

---

## Ejemplo de Uso (cURL)

### Agendar una Cita
```bash
curl -X POST http://localhost:5000/api/appointments/create \
  -H "Content-Type: application/json" \
  -d '{
    "patient_id": 1,
    "therapist_id": 2,
    "scheduled_time": "2024-05-15T14:30:00",
    "duration": 60
  }'
```

### Obtener Lista de Citas
```bash
curl http://localhost:5000/api/appointments/list?patient_id=1
```

---

Para más información, consulta la documentación técnica en `/Documentacion tecnica/`
