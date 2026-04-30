/**
 * API Helper Module
 * Handles all API communication with the backend
 */

const API_BASE_URL = 'http://localhost:5000/api';

const apiClient = {
    // Appointments API
    appointments: {
        create: async (appointmentData) => {
            return fetch(`${API_BASE_URL}/appointments/create`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(appointmentData)
            }).then(r => r.json());
        },
        
        list: async (filters = {}) => {
            const params = new URLSearchParams(filters).toString();
            return fetch(`${API_BASE_URL}/appointments/list?${params}`)
                .then(r => r.json());
        },
        
        get: async (appointmentId) => {
            return fetch(`${API_BASE_URL}/appointments/${appointmentId}`)
                .then(r => r.json());
        },
        
        reschedule: async (appointmentId, newData) => {
            return fetch(`${API_BASE_URL}/appointments/${appointmentId}/reschedule`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(newData)
            }).then(r => r.json());
        },
        
        cancel: async (appointmentId) => {
            return fetch(`${API_BASE_URL}/appointments/${appointmentId}/cancel`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({})
            }).then(r => r.json());
        },
        
        confirm: async (appointmentId) => {
            return fetch(`${API_BASE_URL}/appointments/${appointmentId}/confirm`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({})
            }).then(r => r.json());
        }
    },

    // Patients API
    patients: {
        register: async (patientData) => {
            return fetch(`${API_BASE_URL}/patients/register`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(patientData)
            }).then(r => r.json());
        },
        
        list: async () => {
            return fetch(`${API_BASE_URL}/patients/list`)
                .then(r => r.json());
        },
        
        get: async (patientId) => {
            return fetch(`${API_BASE_URL}/patients/${patientId}`)
                .then(r => r.json());
        },
        
        update: async (patientId, patientData) => {
            return fetch(`${API_BASE_URL}/patients/${patientId}/update`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(patientData)
            }).then(r => r.json());
        },
        
        getAppointments: async (patientId) => {
            return fetch(`${API_BASE_URL}/patients/${patientId}/appointments`)
                .then(r => r.json());
        }
    },

    // Therapists API
    therapists: {
        list: async (filters = {}) => {
            const params = new URLSearchParams(filters).toString();
            return fetch(`${API_BASE_URL}/therapists/list?${params}`)
                .then(r => r.json());
        },
        
        get: async (therapistId) => {
            return fetch(`${API_BASE_URL}/therapists/${therapistId}`)
                .then(r => r.json());
        },
        
        getAvailability: async (therapistId) => {
            return fetch(`${API_BASE_URL}/therapists/${therapistId}/availability`)
                .then(r => r.json());
        }
    },

    // Rooms API
    rooms: {
        list: async (filters = {}) => {
            const params = new URLSearchParams(filters).toString();
            return fetch(`${API_BASE_URL}/rooms/list?${params}`)
                .then(r => r.json());
        },
        
        get: async (roomId) => {
            return fetch(`${API_BASE_URL}/rooms/${roomId}`)
                .then(r => r.json());
        }
    },

    // Notifications API
    notifications: {
        send: async (notificationData) => {
            return fetch(`${API_BASE_URL}/notifications/send`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(notificationData)
            }).then(r => r.json());
        },
        
        scheduleReminder: async (appointmentId, reminderTime) => {
            return fetch(`${API_BASE_URL}/notifications/schedule-reminder/${appointmentId}`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ reminder_time: reminderTime })
            }).then(r => r.json());
        }
    },

    // WhatsApp API
    whatsapp: {
        sendMessage: async (phoneNumber, message) => {
            return fetch(`${API_BASE_URL}/whatsapp/send-message`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ 
                    phone_number: phoneNumber, 
                    message: message 
                })
            }).then(r => r.json());
        },
        
        getConversations: async () => {
            return fetch(`${API_BASE_URL}/whatsapp/conversations`)
                .then(r => r.json());
        },
        
        getConversation: async (phoneNumber) => {
            return fetch(`${API_BASE_URL}/whatsapp/conversations/${phoneNumber}`)
                .then(r => r.json());
        }
    },

    // Health Check
    health: async () => {
        return fetch(`${API_BASE_URL}/health`)
            .then(r => r.json())
            .catch(e => ({ status: 'error', message: 'Backend unavailable' }));
    }
};

// Error handling wrapper
async function makeRequest(requestFn) {
    try {
        const response = await requestFn();
        return response;
    } catch (error) {
        console.error('API Error:', error);
        return {
            success: false,
            error: error.message || 'An error occurred'
        };
    }
}
