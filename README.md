# Backend WhatsApp – Sistema de Agendamiento de Citas Terapéuticas

Rama: `feature/whatsapp-backend`  
Referencia de estilo: [ClinicaWeb](https://github.com/Proyectos-Vinculacion-FMAT/ClinicaWeb)

---

## Descripción

Backend en **Node.js + Express** que implementa el módulo de WhatsApp definido en los requisitos del proyecto. Cubre:

| Requisito | Descripción |
|-----------|-------------|
| RF-W01    | Agendamiento de citas vía chatbot |
| RF-W02    | Reprogramación de citas vía chatbot |
| RFW-03    | Consulta de cita vía chatbot |
| RF-04     | Generación de comprobante PDF |
| RF-06     | Notificaciones automáticas (recordatorio y reprogramación por admin) |
| RNF-02    | Decisiones solo mediante botones y listas (sin texto libre) |
| RNF-03    | Identificación automática por número telefónico |

---

## Estructura

```
whatsapp-backend/
├── src/
│   ├── app.js                        # Punto de entrada
│   ├── config/
│   │   ├── whatsapp.js               # Cliente de WhatsApp Cloud API
│   │   └── db.js                     # Adaptador de base de datos (stub)
│   ├── models/
│   │   └── sesion.model.js           # Estado conversacional por usuario
│   ├── services/
│   │   ├── chatbot.service.js        # Motor conversacional principal
│   │   ├── whatsapp.service.js       # Envío de mensajes (texto/botones/lista/doc)
│   │   ├── notificacion.service.js   # Recordatorios y avisos
│   │   ├── comprobante.service.js    # Generación de PDF
│   │   └── scheduler.service.js     # Cron de recordatorios diarios
│   ├── controllers/
│   │   ├── webhook.controller.js     # GET/POST /webhook
│   │   ├── notificacion.controller.js
│   │   └── cita.controller.js
│   ├── routes/
│   │   ├── webhook.routes.js
│   │   ├── notificacion.routes.js
│   │   └── cita.routes.js
│   └── middleware/
│       ├── auth.js                   # Protección de API interna
│       └── errorHandler.js
├── tests/
│   └── chatbot.test.js
├── storage/comprobantes/             # PDFs generados (ignorado por git)
├── .env.example
└── package.json
```

---

## Configuración

```bash
# 1. Copiar variables de entorno
cp .env.example .env
# Completar: WA_PHONE_NUMBER_ID, WA_ACCESS_TOKEN, WA_WEBHOOK_VERIFY_TOKEN

# 2. Instalar dependencias
npm install

# 3. Ejecutar en desarrollo
npm run dev

# 4. Tests
npm test
```

---

## Endpoints

### Webhook (Meta)
| Método | Ruta       | Descripción |
|--------|------------|-------------|
| GET    | `/webhook` | Verificación del webhook por Meta |
| POST   | `/webhook` | Recepción de mensajes de usuarios |

### API Interna (requiere Bearer token)
| Método | Ruta | Descripción |
|--------|------|-------------|
| GET    | `/api/citas/:telefono` | Consulta cita activa del usuario |
| POST   | `/api/citas`           | Crea nueva cita |
| PUT    | `/api/citas/:citaId`   | Actualiza fecha/hora de cita |
| POST   | `/api/notificaciones/reprogramacion` | Envía aviso de reprogramación por admin |

---

## Flujo conversacional

```
Usuario escribe por WhatsApp
        │
        ▼
¿Número registrado? ──No──► Mensaje de registro web
        │ Sí
        ▼
    MENÚ PRINCIPAL
   [Agendar] [Ver cita] [Reprogramar]
        │
   ┌────┴────────────────┐
   ▼                     ▼
AGENDAR              REPROGRAMAR
1. Seleccionar       1. Ver cita actual
   terapeuta (lista) 2. Confirmar intención
2. Seleccionar       3. Nueva fecha (lista)
   fecha (lista)     4. Nueva hora (lista)
3. Seleccionar       5. Confirmar (botones)
   hora (lista)      → Actualizar DB
4. Confirmar         → Regenerar PDF
   (botones)         → Enviar comprobante
→ Crear cita en DB
→ Generar PDF
→ Enviar comprobante
```

---

## Integración con sistema Web

El sistema web (frontend existente) debe llamar a este backend cuando:

1. **Un administrador reprograma una cita:**
   ```
   POST /api/notificaciones/reprogramacion
   Authorization: Bearer <JWT_SECRET>
   { citaId, telefonoUsuario, nombreUsuario, fechaAntigua, horaAntigua }
   ```

2. **Se crea/actualiza una cita desde la web** → usar `/api/citas`

---

## Base de datos

El archivo `src/config/db.js` contiene un **stub en memoria** para desarrollo. En producción, reemplazar cada función con queries reales a PostgreSQL (o el motor del equipo). La interfaz de funciones se mantiene igual, solo cambia la implementación interna.

---

## Variables de entorno requeridas

| Variable | Descripción |
|----------|-------------|
| `WA_PHONE_NUMBER_ID` | ID del número de teléfono en Meta |
| `WA_ACCESS_TOKEN` | Token permanente de acceso a la API |
| `WA_WEBHOOK_VERIFY_TOKEN` | Token secreto para verificar el webhook |
| `JWT_SECRET` | Clave para proteger la API interna |
| `COMPROBANTE_BASE_URL` | URL pública base para servir PDFs |
| `REMINDER_CRON_HOUR` | Hora del cron de recordatorios (24h) |
