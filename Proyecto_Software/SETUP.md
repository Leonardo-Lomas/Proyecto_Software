# Clínica Digital - Sistema de Agendamiento de Citas

## Descripción General

**Clínica Digital** es un sistema integral de gestión de citas que permite:
- 📅 Agendar, visualizar y reagendar citas de forma rápida
- 🤖 Automatizar notificaciones a través de WhatsApp
- 👥 Gestionar información de pacientes, terapeutas y salas
- 📊 Generar reportes de disponibilidad

El sistema está diseñado con una interfaz web moderna y una integración completa con la API de WhatsApp Business para mejorar la experiencia del usuario.

## Características Principales

### 1. **Módulo Web**
- Interfaz responsiva y moderna
- Agendar citas fácilmente
- Ver historial de citas
- Reagendar o cancelar citas
- Gestionar perfil de usuario
- Recordatorios automáticos

### 2. **Módulo WhatsApp**
- Bot conversacional inteligente
- Menú de opciones principal
- Agendar citas por WhatsApp
- Visualizar próximas citas
- Reagendar citas
- Cancelar citas
- Recordatorios automáticos 24 horas antes

### 3. **Gestión de Recursos**
- Administración de pacientes
- Gestión de terapeutas y su disponibilidad
- Control de salas/espacios
- Notificaciones automáticas

## Tecnologías Utilizadas

### Backend
- **Framework:** Flask 2.3.3
- **Base de Datos:** SQLAlchemy (compatible con SQLite, PostgreSQL, MySQL)
- **Autenticación:** JWT
- **CORS:** Habilitado para integración frontend
- **Integraciones:** WhatsApp Business API

### Frontend
- **HTML5** - Estructura semántica
- **CSS3** - Diseño responsivo y moderno
- **JavaScript Vanilla** - Lógica de aplicación
- **FontAwesome** - Iconografía
- **API REST** - Comunicación con backend

### DevOps
- **Server:** Gunicorn (producción)
- **WSGI:** Compatible con Heroku, AWS, DigitalOcean

## Estructura del Proyecto

```
Proyecto_Software/
├── backend/
│   ├── app.py                 # Aplicación principal Flask
│   ├── requirements.txt        # Dependencias Python
│   ├── .env.example            # Ejemplo de variables de entorno
│   ├── models/
│   │   └── models.py          # Modelos de datos
│   ├── routes/
│   │   ├── appointments.py    # API de citas
│   │   ├── patients.py        # API de pacientes
│   │   ├── therapists.py      # API de terapeutas
│   │   ├── rooms.py           # API de salas
│   │   ├── whatsapp.py        # Integración WhatsApp
│   │   └── notifications.py   # Notificaciones
│   ├── services/              # Lógica de negocio
│   └── utils/                 # Utilidades
│
├── frontend/
│   ├── index.html             # Página principal
│   ├── css/
│   │   ├── styles.css         # Estilos principales
│   │   └── responsive.css     # Diseño responsivo
│   ├── js/
│   │   ├── app.js             # Controlador principal
│   │   ├── api.js             # Cliente API
│   │   └── appointments.js    # Funciones de citas
│   └── assets/                # Imágenes y recursos
│
├── whatsapp_bot/              # Lógica del bot WhatsApp
├── database/                  # Scripts de base de datos
├── Documentacion tecnica/     # Documentación del proyecto
└── README.md                  # Este archivo
```

## Instalación y Configuración

### Requisitos Previos
- Python 3.8+
- Node.js/npm (opcional, para herramientas frontend)
- Cuenta de WhatsApp Business
- Servidor web (para producción)

### Backend Setup

1. **Clonar el repositorio:**
```bash
git clone https://github.com/Leonardo-Lomas/Proyecto_Software.git
cd Proyecto_Software/backend
```

2. **Crear entorno virtual:**
```bash
python -m venv venv
source venv/bin/activate  # En Windows: venv\Scripts\activate
```

3. **Instalar dependencias:**
```bash
pip install -r requirements.txt
```

4. **Configurar variables de entorno:**
```bash
cp .env.example .env
# Editar .env con tus valores
```

5. **Ejecutar la aplicación:**
```bash
python app.py
```

El servidor estará disponible en `http://localhost:5000`

### Frontend Setup

1. **Servir archivos estáticos:**
```bash
cd ../frontend

# Opción 1: Python HTTP Server
python -m http.server 8000

# Opción 2: Con Node.js
npm install -g http-server
http-server
```

La aplicación estará disponible en `http://localhost:8000`

## Configuración de WhatsApp

### 1. Crear Cuenta de WhatsApp Business
- Acceder a [Meta Business Suite](https://business.facebook.com)
- Crear cuenta de WhatsApp Business
- Obtener credenciales:
  - `WHATSAPP_BUSINESS_ACCOUNT_ID`
  - `WHATSAPP_PHONE_NUMBER_ID`
  - `WHATSAPP_ACCESS_TOKEN`

### 2. Configurar Webhook
- URL del webhook: `https://tu-dominio.com/api/whatsapp/webhook`
- Token de verificación: Generar un token seguro
- Suscribirse a eventos: `message`, `message_status`

### 3. Actualizar .env
```env
WHATSAPP_BUSINESS_ACCOUNT_ID=tu_account_id
WHATSAPP_PHONE_NUMBER_ID=tu_phone_id
WHATSAPP_ACCESS_TOKEN=tu_token
WHATSAPP_WEBHOOK_VERIFY_TOKEN=tu_webhook_token
```

## API Endpoints

### Citas
- `POST /api/appointments/create` - Agendar cita
- `GET /api/appointments/list` - Listar citas
- `GET /api/appointments/<id>` - Obtener detalle
- `PUT /api/appointments/<id>/reschedule` - Reagendar
- `PUT /api/appointments/<id>/cancel` - Cancelar
- `PUT /api/appointments/<id>/confirm` - Confirmar

### Pacientes
- `POST /api/patients/register` - Registrar paciente
- `GET /api/patients/list` - Listar pacientes
- `GET /api/patients/<id>` - Obtener detalle
- `PUT /api/patients/<id>/update` - Actualizar
- `GET /api/patients/<id>/appointments` - Citas del paciente

### Terapeutas
- `GET /api/therapists/list` - Listar terapeutas
- `GET /api/therapists/<id>` - Obtener detalle
- `GET /api/therapists/<id>/availability` - Disponibilidad

### WhatsApp
- `GET /api/whatsapp/webhook` - Verificación webhook
- `POST /api/whatsapp/webhook` - Recibir mensajes
- `POST /api/whatsapp/send-message` - Enviar mensaje
- `GET /api/whatsapp/conversations` - Listar conversaciones

## Flujo de Usuario

### Flujo Web
1. Usuario accede a la página principal
2. Completa su perfil (si es nuevo usuario)
3. Ve el dashboard con sus citas
4. Puede agendar una nueva cita
5. Recibe confirmación y recordatorios

### Flujo WhatsApp
1. Usuario inicia conversación con el bot
2. Sistema muestra menú principal
3. Usuario selecciona opción (1-5)
4. Sistema guía al usuario por el proceso
5. Usuario recibe confirmación

**Opciones del Menú WhatsApp:**
1. Agendar una cita
2. Ver mis citas
3. Reagendar cita
4. Cancelar cita
5. Información de la clínica

## Notificaciones Automáticas

El sistema envía notificaciones automáticas:
- **24 horas antes:** Recordatorio de la cita
- **1 hora antes:** Último recordatorio
- **Confirmación:** Al agendar la cita
- **Reagendamiento:** Confirmación de cambio
- **Cancelación:** Confirmación de cancelación

## Seguridad

- ✅ Tokens JWT para autenticación
- ✅ CORS configurado
- ✅ Variables de entorno para credenciales
- ✅ Validación de datos en backend
- ✅ HTTPS recomendado en producción
- ✅ Rate limiting (implementar en producción)

## Desarrollo

### Hacer cambios en el código

1. Crear rama de desarrollo:
```bash
git checkout -b feature/nueva-funcionalidad
```

2. Realizar cambios y commits:
```bash
git add .
git commit -m "Descripción del cambio"
```

3. Subir cambios:
```bash
git push origin feature/nueva-funcionalidad
```

4. Crear Pull Request

### Testing
```bash
# Backend (pytest)
pip install pytest
pytest backend/

# Frontend (manual o con Jest)
npm test
```

## Deployment

### Heroku
```bash
heroku create tu-app-name
heroku config:set FLASK_ENV=production
git push heroku main
```

### AWS/DigitalOcean
```bash
# Crear servidor
# Instalar Python, git
# Clonar repositorio
# Instalar dependencias
# Configurar nginx/gunicorn
# Configurar SSL con Let's Encrypt
```

## Troubleshooting

| Problema | Solución |
|----------|----------|
| API no responde | Verificar que servidor backend está corriendo en puerto 5000 |
| WhatsApp no funciona | Verificar token y credenciales en .env |
| CORS error | Verificar que CORS está habilitado en flask |
| BD no se crea | Verificar permisos de directorio |

## Roadmap

- [ ] Base de datos integrada (PostgreSQL)
- [ ] Sistema de autenticación completo
- [ ] Dashboard admin
- [ ] Reportes estadísticos
- [ ] Integración con Google Calendar
- [ ] Aplicación móvil
- [ ] Video consultas
- [ ] Sistema de pagos

## Contribuidores

- Leonardo Lomas
- [Otros contribuidores]

## Licencia

Este proyecto está bajo licencia MIT.

## Soporte

Para soporte, contactar a través de:
- 📧 Email: support@clinicadigital.com
- 💬 WhatsApp: +1-800-CLINIC
- 🐛 Issues: GitHub Issues

## Actualizaciones

Ver [CHANGELOG.md](CHANGELOG.md) para historial de cambios.

---

**Última actualización:** Abril 29, 2024
**Versión:** 1.0.0
