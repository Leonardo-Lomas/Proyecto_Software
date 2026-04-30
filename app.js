
require('dotenv').config();
const express  = require('express');
const cors     = require('cors');
const morgan   = require('morgan');

const webhookRoutes      = require('./routes/webhook.routes');
const notificacionRoutes = require('./routes/notificacion.routes');
const citaRoutes         = require('./routes/cita.routes');
const errorHandler       = require('./middleware/errorHandler');
const scheduler          = require('./services/scheduler.service');

const app  = express();
const PORT = process.env.PORT || 3000;

/* ── Middleware global ──────────────────────────────────────── */
app.use(cors());
app.use(morgan('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

/* ── Rutas ──────────────────────────────────────────────────── */
// Webhook de Meta (GET = verificación, POST = mensajes entrantes)
app.use('/webhook', webhookRoutes);


app.use('/api/notificaciones', notificacionRoutes);


app.use('/api/citas', citaRoutes);

/* ── Health check ───────────────────────────────────────────── */
app.get('/health', (_req, res) => res.json({ status: 'ok', ts: new Date() }));

/* ── Manejo de errores ──────────────────────────────────────── */
app.use(errorHandler);

/* ── Arranque ───────────────────────────────────────────────── */
app.listen(PORT, () => {
  console.log(`[WhatsApp Backend] Servidor corriendo en puerto ${PORT}`);
  scheduler.iniciar(); // activa cron de recordatorios
});

module.exports = app; // para tests
