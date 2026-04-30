/**
 * Appointments Management Module
 * Additional functionality for appointment handling
 */

/**
 * Get appointment status color
 */
function getStatusColor(status) {
    const colors = {
        'scheduled': '#2196F3',
        'confirmed': '#4CAF50',
        'completed': '#9C27B0',
        'cancelled': '#F44336',
        'rescheduled': '#FF9800',
        'no_show': '#FF5722'
    };
    return colors[status] || '#757575';
}

/**
 * Get appointment status text in Spanish
 */
function getStatusText(status) {
    const texts = {
        'scheduled': 'Agendada',
        'confirmed': 'Confirmada',
        'completed': 'Completada',
        'cancelled': 'Cancelada',
        'rescheduled': 'Reagendada',
        'no_show': 'No asistió'
    };
    return texts[status] || status;
}

/**
 * Format date to readable string
 */
function formatDate(dateString) {
    const date = new Date(dateString);
    const today = new Date();
    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);

    const isToday = date.toDateString() === today.toDateString();
    const isTomorrow = date.toDateString() === tomorrow.toDateString();

    if (isToday) {
        return `Hoy a las ${date.toLocaleTimeString('es-MX', { hour: '2-digit', minute: '2-digit' })}`;
    } else if (isTomorrow) {
        return `Mañana a las ${date.toLocaleTimeString('es-MX', { hour: '2-digit', minute: '2-digit' })}`;
    } else {
        return date.toLocaleDateString('es-MX', { 
            weekday: 'long', 
            year: 'numeric', 
            month: 'long', 
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        });
    }
}

/**
 * Check if appointment is soon (within 24 hours)
 */
function isAppointmentSoon(dateString) {
    const appointmentDate = new Date(dateString);
    const now = new Date();
    const hoursDifference = (appointmentDate - now) / (1000 * 60 * 60);
    return hoursDifference > 0 && hoursDifference <= 24;
}

/**
 * Calculate days until appointment
 */
function daysUntilAppointment(dateString) {
    const appointmentDate = new Date(dateString);
    const now = new Date();
    const timeDifference = appointmentDate - now;
    const daysDifference = Math.ceil(timeDifference / (1000 * 60 * 60 * 24));
    return daysDifference;
}

/**
 * Send appointment reminder via WhatsApp
 */
async function sendAppointmentReminder(phoneNumber, appointmentData) {
    const message = `
🏥 *Recordatorio de tu Cita*

📅 Fecha: ${formatDate(appointmentData.scheduled_time)}
⏱️ Duración: ${appointmentData.duration} minutos
👨‍⚕️ Terapeuta: ${appointmentData.therapist_name || 'Por confirmar'}

Si necesitas reagendar, responde con 1️⃣
Si deseas cancelar, responde con 2️⃣

¡Gracias por confiar en Clínica Digital!
    `;

    return await makeRequest(() => 
        apiClient.whatsapp.sendMessage(phoneNumber, message)
    );
}

/**
 * Schedule automatic reminders for appointment
 */
async function scheduleAppointmentReminders(appointmentId, scheduledTime, phoneNumber) {
    // Schedule reminder 24 hours before
    const date24Before = new Date(new Date(scheduledTime).getTime() - (24 * 60 * 60 * 1000));
    
    // Schedule reminder 1 hour before
    const date1Before = new Date(new Date(scheduledTime).getTime() - (60 * 60 * 1000));

    const promises = [
        makeRequest(() => 
            apiClient.notifications.scheduleReminder(appointmentId, date24Before.toISOString())
        ),
        makeRequest(() => 
            apiClient.notifications.scheduleReminder(appointmentId, date1Before.toISOString())
        )
    ];

    return Promise.all(promises);
}

/**
 * Export appointment to calendar
 */
function exportAppointmentToCalendar(appointment) {
    const startDate = new Date(appointment.scheduled_time);
    const endDate = new Date(startDate.getTime() + appointment.duration * 60 * 1000);

    const icsContent = `
BEGIN:VCALENDAR
VERSION:2.0
PRODID:-//Clínica Digital//EN
CALSCALE:GREGORIAN
METHOD:PUBLISH
X-WR-CALNAME:Citas Clínica Digital
X-WR-TIMEZONE:America/Mexico_City

BEGIN:VEVENT
DTSTART:${startDate.toISOString().replace(/[-:]/g, '').split('.')[0]}Z
DTEND:${endDate.toISOString().replace(/[-:]/g, '').split('.')[0]}Z
DTSTAMP:${new Date().toISOString().replace(/[-:]/g, '').split('.')[0]}Z
UID:${appointment.id}@clinicadigital.com
CREATED:${new Date().toISOString()}
DESCRIPTION:Cita médica en Clínica Digital
LAST-MODIFIED:${new Date().toISOString()}
SUMMARY:Cita - ${appointment.type || 'Cita general'}
STATUS:CONFIRMED
END:VEVENT

END:VCALENDAR
    `.trim();

    const element = document.createElement('a');
    element.setAttribute('href', `data:text/calendar;charset=utf-8,${encodeURIComponent(icsContent)}`);
    element.setAttribute('download', `cita-${appointment.id}.ics`);
    element.style.display = 'none';
    
    document.body.appendChild(element);
    element.click();
    document.body.removeChild(element);
}

/**
 * Print appointment details
 */
function printAppointment(appointment) {
    const printWindow = window.open('', '', 'height=500,width=700');
    printWindow.document.write(`
        <html>
        <head>
            <title>Detalles de tu Cita</title>
            <style>
                body { font-family: Arial, sans-serif; margin: 20px; }
                .header { text-align: center; color: #2E7D32; margin-bottom: 30px; }
                .details { margin: 20px 0; line-height: 1.8; }
                .detail-item { margin: 10px 0; border-bottom: 1px solid #ddd; padding-bottom: 10px; }
                .label { font-weight: bold; color: #2E7D32; }
                .footer { text-align: center; margin-top: 40px; color: #999; font-size: 12px; }
            </style>
        </head>
        <body>
            <div class="header">
                <h1>🏥 Clínica Digital</h1>
                <h2>Comprobante de Cita</h2>
            </div>
            <div class="details">
                <div class="detail-item">
                    <span class="label">ID de Cita:</span> ${appointment.id}
                </div>
                <div class="detail-item">
                    <span class="label">Fecha y Hora:</span> ${formatDate(appointment.scheduled_time)}
                </div>
                <div class="detail-item">
                    <span class="label">Duración:</span> ${appointment.duration} minutos
                </div>
                <div class="detail-item">
                    <span class="label">Estado:</span> ${getStatusText(appointment.status)}
                </div>
                ${appointment.notes ? `
                <div class="detail-item">
                    <span class="label">Notas:</span> ${appointment.notes}
                </div>
                ` : ''}
            </div>
            <div class="footer">
                <p>Conserva este comprobante para tu registro</p>
                <p>Para cambios, contacta a través de WhatsApp</p>
            </div>
        </body>
        </html>
    `);
    printWindow.document.close();
    printWindow.print();
}

/**
 * Share appointment via WhatsApp
 */
function shareAppointmentViaWhatsApp(appointment, phoneNumber) {
    const message = encodeURIComponent(`
🏥 *Mi Cita en Clínica Digital*

📅 ${formatDate(appointment.scheduled_time)}
⏱️ Duración: ${appointment.duration} minutos
👨‍⚕️ Terapeuta: ${appointment.therapist_name || 'Por confirmar'}
📍 Ubicación: Clínica Digital

¡Nos vemos pronto!
    `);

    window.open(`https://wa.me/${phoneNumber}?text=${message}`, '_blank');
}
