// src/services/chatbot.service.js
// ============================================================
//  Motor conversacional del chatbot de WhatsApp
//
//  Implementa los flujos definidos en:
//  RF-W01  Agendamiento vía chatbot
//  RF-W02  Reprogramación vía chatbot
//  RFW-03  Consulta de cita vía chatbot
//  RNF-02  Decisiones solo mediante botones/listas
//  RNF-03  Identificación por número telefónico (sin login)
// ============================================================

const db                  = require('../config/db');
const sesionModel         = require('../models/sesion.model');
const whatsappService     = require('./whatsapp.service');
const comprobanteService  = require('./comprobante.service');

const { FLUJOS, PASOS_AGENDAR, PASOS_REPROGRAMAR } = sesionModel;

// ── Menú principal ────────────────────────────────────────────
const mostrarMenu = async (telefono, nombre) => {
  await whatsappService.enviarBotones(
    telefono,
    `Hola ${nombre} 👋 ¿Qué deseas hacer?`,
    [
      { id: 'agendar',     titulo: '📅 Agendar cita'     },
      { id: 'consultar',   titulo: '🔍 Ver mi cita'       },
      { id: 'reprogramar', titulo: '🔄 Reprogramar cita'  },
    ],
  );
};

// ── Helpers de formato ────────────────────────────────────────
const formatearCita = (cita, terapeuta) =>
  `📋 *Cita agendada*\n` +
  `📅 Fecha: ${cita.fecha}\n` +
  `🕐 Hora: ${cita.hora}\n` +
  `👨‍⚕️ Terapeuta: ${terapeuta ? terapeuta.nombre : 'N/D'}\n` +
  `🏥 Consultorio: ${cita.consultorio}`;

// ── Chatbot principal ─────────────────────────────────────────
const chatbotService = {

  procesarMensaje: async ({ telefono, tipo, contenido, messageId }) => {

    // 1. Marcar como leído
    if (messageId) await whatsappService.marcarLeido(messageId).catch(() => {});

    // 2. Identificar usuario (RNF-03: por número telefónico)
    let sesion = sesionModel.obtener(telefono);

    if (!sesion) {
      const usuario = await db.buscarUsuarioPorTelefono(telefono);
      if (!usuario) {
        // Usuario no registrado: redirigir a registro web (RF-05)
        await whatsappService.enviarTexto(
          telefono,
          'No encontramos tu número registrado.\n' +
          'Por favor regístrate en nuestra plataforma web para usar este servicio. 🌐',
        );
        return;
      }
      sesion = sesionModel.crear(telefono, usuario);
      await mostrarMenu(telefono, usuario.nombre);
      return;
    }

    const { usuario } = sesion;

    // 3. Extraer respuesta del usuario
    let respuesta = '';
    if (tipo === 'interactive') {
      respuesta = contenido?.button_reply?.id || contenido?.list_reply?.id || '';
    } else if (tipo === 'text') {
      respuesta = contenido?.body?.trim() || '';
    }

    // 4. Despachar al flujo correcto
    if (sesion.flujo === FLUJOS.MENU || !sesion.paso) {
      await chatbotService._manejarMenu(sesion, telefono, respuesta, usuario);
    } else if (sesion.flujo === FLUJOS.AGENDAR) {
      await chatbotService._manejarAgendar(sesion, telefono, respuesta, usuario);
    } else if (sesion.flujo === FLUJOS.CONSULTAR) {
      await chatbotService._manejarConsultar(sesion, telefono, usuario);
    } else if (sesion.flujo === FLUJOS.REPROGRAMAR) {
      await chatbotService._manejarReprogramar(sesion, telefono, respuesta, usuario);
    }
  },

  // ── MENÚ ────────────────────────────────────────────────────
  _manejarMenu: async (sesion, telefono, respuesta, usuario) => {
    if (respuesta === 'agendar') {
      sesionModel.actualizar(telefono, { flujo: FLUJOS.AGENDAR, paso: PASOS_AGENDAR[0], datos: {} });
      await chatbotService._mostrarTerapeutas(telefono);

    } else if (respuesta === 'consultar') {
      sesionModel.actualizar(telefono, { flujo: FLUJOS.CONSULTAR, paso: 'MOSTRANDO', datos: {} });
      await chatbotService._manejarConsultar(sesion, telefono, usuario);

    } else if (respuesta === 'reprogramar') {
      sesionModel.actualizar(telefono, { flujo: FLUJOS.REPROGRAMAR, paso: PASOS_REPROGRAMAR[0], datos: {} });
      await chatbotService._manejarReprogramar(
        sesionModel.obtener(telefono), telefono, respuesta, usuario,
      );

    } else {
      await mostrarMenu(telefono, usuario.nombre);
    }
  },

  // ── AGENDAR (RF-W01) ─────────────────────────────────────────
  _mostrarTerapeutas: async (telefono) => {
    const terapeutas = await db.listarTerapeutas();
    const filas = terapeutas.map(t => ({
      id: `ter_${t.id}`,
      titulo: t.nombre,
      descripcion: t.especialidad,
    }));
    await whatsappService.enviarLista(
      telefono,
      'Selecciona a tu terapeuta:',
      'Ver terapeutas',
      [{ titulo: 'Terapeutas disponibles', filas }],
    );
  },

  _manejarAgendar: async (sesion, telefono, respuesta, usuario) => {
    const { paso, datos } = sesion;

    // Paso 1: Seleccionar terapeuta
    if (paso === 'SELECCIONAR_TERAPEUTA') {
      if (!respuesta.startsWith('ter_')) {
        await chatbotService._mostrarTerapeutas(telefono);
        return;
      }
      const terapeutaId = respuesta.replace('ter_', '');
      const terapeuta   = await db.buscarTerapeuta(terapeutaId);
      if (!terapeuta) {
        await whatsappService.enviarTexto(telefono, 'Terapeuta no encontrado. Intenta de nuevo.');
        await chatbotService._mostrarTerapeutas(telefono);
        return;
      }
      sesionModel.actualizar(telefono, {
        paso: 'SELECCIONAR_FECHA',
        datos: { ...datos, terapeutaId, terapeutaNombre: terapeuta.nombre },
      });
      await chatbotService._mostrarFechasDisponibles(telefono, terapeutaId);
      return;
    }

    // Paso 2: Seleccionar fecha
    if (paso === 'SELECCIONAR_FECHA') {
      if (!respuesta.startsWith('fecha_')) {
        await chatbotService._mostrarFechasDisponibles(telefono, datos.terapeutaId);
        return;
      }
      const fecha = respuesta.replace('fecha_', '');
      sesionModel.actualizar(telefono, { paso: 'SELECCIONAR_HORA', datos: { ...datos, fecha } });
      await chatbotService._mostrarHorasDisponibles(telefono, datos.terapeutaId, fecha);
      return;
    }

    // Paso 3: Seleccionar hora
    if (paso === 'SELECCIONAR_HORA') {
      if (!respuesta.startsWith('hora_')) {
        await chatbotService._mostrarHorasDisponibles(telefono, datos.terapeutaId, datos.fecha);
        return;
      }
      const hora = respuesta.replace('hora_', '');
      sesionModel.actualizar(telefono, { paso: 'CONFIRMAR', datos: { ...datos, hora } });

      const resumen =
        `✅ *Confirma tu cita:*\n` +
        `👨‍⚕️ Terapeuta: ${datos.terapeutaNombre}\n` +
        `📅 Fecha: ${datos.fecha}\n` +
        `🕐 Hora: ${hora}`;
      await whatsappService.enviarBotones(telefono, resumen, [
        { id: 'confirmar_si', titulo: '✅ Confirmar' },
        { id: 'confirmar_no', titulo: '❌ Cancelar'  },
      ]);
      return;
    }

    // Paso 4: Confirmar
    if (paso === 'CONFIRMAR') {
      if (respuesta === 'confirmar_si') {
        // Verificar que no tenga cita activa (RF-01: solo 1 cita por usuario)
        const citaExistente = await db.buscarCitaPorUsuario(usuario.id);
        if (citaExistente) {
          await whatsappService.enviarTexto(
            telefono,
            'Ya tienes una cita agendada. Debes reprogramarla antes de agendar una nueva.',
          );
          sesionModel.actualizar(telefono, { flujo: FLUJOS.MENU, paso: null, datos: {} });
          await mostrarMenu(telefono, usuario.nombre);
          return;
        }

        const nuevaCita = await db.crearCita({
          usuarioId:   usuario.id,
          terapeutaId: datos.terapeutaId,
          fecha:       datos.fecha,
          hora:        datos.hora,
          consultorio: 'Consultorio 1', // asignado automáticamente (RF-01)
        });

        // Generar comprobante (RF-04)
        const terapeuta = await db.buscarTerapeuta(datos.terapeutaId);
        await comprobanteService.generar({
          folio:       nuevaCita.folioComprobante,
          paciente:    usuario.nombre,
          terapeuta:   terapeuta ? terapeuta.nombre : datos.terapeutaNombre,
          fecha:       nuevaCita.fecha,
          hora:        nuevaCita.hora,
          consultorio: nuevaCita.consultorio,
        });

        await whatsappService.enviarTexto(
          telefono,
          `🎉 ¡Cita agendada con éxito!\nFolio: ${nuevaCita.folioComprobante}`,
        );

        const urlComp = comprobanteService.obtenerUrl(nuevaCita.folioComprobante);
        if (urlComp) {
          await whatsappService.enviarDocumento(
            telefono,
            urlComp,
            `${nuevaCita.folioComprobante}.pdf`,
            'Tu comprobante de cita',
          );
        }

      } else {
        await whatsappService.enviarTexto(telefono, 'Agendamiento cancelado.');
      }

      sesionModel.actualizar(telefono, { flujo: FLUJOS.MENU, paso: null, datos: {} });
      await mostrarMenu(telefono, usuario.nombre);
      return;
    }
  },

  // ── CONSULTAR (RFW-03) ────────────────────────────────────────
  _manejarConsultar: async (sesion, telefono, usuario) => {
    const cita = await db.buscarCitaPorUsuario(usuario.id);
    if (!cita) {
      await whatsappService.enviarTexto(telefono, 'No tienes ninguna cita próxima registrada.');
    } else {
      const terapeuta = await db.buscarTerapeuta(cita.terapeutaId);
      await whatsappService.enviarTexto(telefono, formatearCita(cita, terapeuta));

      const urlComp = comprobanteService.obtenerUrl(cita.folioComprobante);
      if (urlComp) {
        await whatsappService.enviarDocumento(
          telefono,
          urlComp,
          `${cita.folioComprobante}.pdf`,
          'Tu comprobante',
        );
      }
    }
    sesionModel.actualizar(telefono, { flujo: FLUJOS.MENU, paso: null, datos: {} });
    await mostrarMenu(telefono, usuario.nombre);
  },

  // ── REPROGRAMAR (RF-W02) ──────────────────────────────────────
  _manejarReprogramar: async (sesion, telefono, respuesta, usuario) => {
    const { paso, datos } = sesion;

    // Paso 0: Mostrar cita actual
    if (paso === 'MOSTRAR_CITA_ACTUAL' || respuesta === 'reprogramar') {
      const cita = await db.buscarCitaPorUsuario(usuario.id);
      if (!cita) {
        await whatsappService.enviarTexto(telefono, 'No tienes ninguna cita que reprogramar.');
        sesionModel.actualizar(telefono, { flujo: FLUJOS.MENU, paso: null, datos: {} });
        await mostrarMenu(telefono, usuario.nombre);
        return;
      }
      const terapeuta = await db.buscarTerapeuta(cita.terapeutaId);
      sesionModel.actualizar(telefono, {
        flujo: FLUJOS.REPROGRAMAR,
        paso: 'CONFIRMAR_INTENCION',
        datos: {
          citaId:          cita.id,
          terapeutaId:     cita.terapeutaId,
          terapeutaNombre: terapeuta ? terapeuta.nombre : 'Tu terapeuta',
          fechaAntigua:    cita.fecha,
          horaAntigua:     cita.hora,
          folio:           cita.folioComprobante,
        },
      });
      await whatsappService.enviarBotones(
        telefono,
        formatearCita(cita, terapeuta) + '\n\n¿Deseas reprogramar esta cita?',
        [
          { id: 'rep_si', titulo: '✅ Sí, reprogramar' },
          { id: 'rep_no', titulo: '❌ No, volver'       },
        ],
      );
      return;
    }

    // Paso 1: Confirmar intención
    if (paso === 'CONFIRMAR_INTENCION') {
      if (respuesta === 'rep_si') {
        sesionModel.actualizar(telefono, { paso: 'SELECCIONAR_FECHA' });
        await chatbotService._mostrarFechasDisponibles(telefono, datos.terapeutaId);
      } else {
        sesionModel.actualizar(telefono, { flujo: FLUJOS.MENU, paso: null, datos: {} });
        await mostrarMenu(telefono, usuario.nombre);
      }
      return;
    }

    // Paso 2: Seleccionar nueva fecha
    if (paso === 'SELECCIONAR_FECHA') {
      if (!respuesta.startsWith('fecha_')) {
        await chatbotService._mostrarFechasDisponibles(telefono, datos.terapeutaId);
        return;
      }
      const fecha = respuesta.replace('fecha_', '');
      sesionModel.actualizar(telefono, { paso: 'SELECCIONAR_HORA', datos: { ...datos, fecha } });
      await chatbotService._mostrarHorasDisponibles(telefono, datos.terapeutaId, fecha);
      return;
    }

    // Paso 3: Seleccionar nueva hora
    if (paso === 'SELECCIONAR_HORA') {
      if (!respuesta.startsWith('hora_')) {
        await chatbotService._mostrarHorasDisponibles(telefono, datos.terapeutaId, datos.fecha);
        return;
      }
      const hora = respuesta.replace('hora_', '');
      sesionModel.actualizar(telefono, { paso: 'CONFIRMAR', datos: { ...datos, hora } });

      const resumen =
        `🔄 *Confirma la reprogramación:*\n` +
        `Antes: ${datos.fechaAntigua} ${datos.horaAntigua}\n` +
        `Ahora: ${datos.fecha} ${hora}`;
      await whatsappService.enviarBotones(telefono, resumen, [
        { id: 'rep_conf_si', titulo: '✅ Confirmar' },
        { id: 'rep_conf_no', titulo: '❌ Cancelar'  },
      ]);
      return;
    }

    // Paso 4: Confirmar reprogramación
    if (paso === 'CONFIRMAR') {
      if (respuesta === 'rep_conf_si') {
        const citaActualizada = await db.actualizarCita(datos.citaId, {
          fecha: datos.fecha,
          hora:  datos.hora,
        });

        // Regenerar comprobante con nuevos datos (RF-04)
        const terapeuta = await db.buscarTerapeuta(datos.terapeutaId);
        await comprobanteService.generar({
          folio:       datos.folio,
          paciente:    usuario.nombre,
          terapeuta:   terapeuta ? terapeuta.nombre : datos.terapeutaNombre,
          fecha:       citaActualizada.fecha,
          hora:        citaActualizada.hora,
          consultorio: citaActualizada.consultorio,
        });

        await whatsappService.enviarTexto(
          telefono,
          `✅ ¡Cita reprogramada!\nNueva fecha: ${citaActualizada.fecha} a las ${citaActualizada.hora}`,
        );

        const urlComp = comprobanteService.obtenerUrl(datos.folio);
        if (urlComp) {
          await whatsappService.enviarDocumento(
            telefono,
            urlComp,
            `${datos.folio}.pdf`,
            'Comprobante actualizado',
          );
        }
      } else {
        await whatsappService.enviarTexto(telefono, 'Reprogramación cancelada.');
      }

      sesionModel.actualizar(telefono, { flujo: FLUJOS.MENU, paso: null, datos: {} });
      await mostrarMenu(telefono, usuario.nombre);
      return;
    }
  },

  // ── Helpers de disponibilidad ─────────────────────────────────
  _mostrarFechasDisponibles: async (telefono, terapeutaId) => {
    const hoy   = new Date().toISOString().split('T')[0];
    const slots = await db.obtenerDisponibilidad(terapeutaId, hoy);

    // Agrupar fechas únicas
    const fechas = [...new Set(slots.map(s => s.fecha))].slice(0, 7);
    const filas  = fechas.map(f => ({ id: `fecha_${f}`, titulo: f }));

    await whatsappService.enviarLista(
      telefono,
      'Selecciona la fecha de tu cita:',
      'Ver fechas',
      [{ titulo: 'Fechas disponibles', filas }],
    );
  },

  _mostrarHorasDisponibles: async (telefono, terapeutaId, fecha) => {
    const hoy   = new Date().toISOString().split('T')[0];
    const slots = await db.obtenerDisponibilidad(terapeutaId, hoy);
    const horas = slots.filter(s => s.fecha === fecha).map(s => s.hora);

    const filas = horas.map(h => ({ id: `hora_${h}`, titulo: h }));
    await whatsappService.enviarLista(
      telefono,
      `Horarios disponibles para ${fecha}:`,
      'Ver horarios',
      [{ titulo: 'Horarios', filas }],
    );
  },
};

module.exports = chatbotService;
