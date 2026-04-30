/**
 * Main Application Controller
 * Handles navigation, UI interactions, and app initialization
 */

// Current user (loaded from localStorage or API)
let currentUser = null;

// Initialize app when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
    initializeApp();
    setupEventListeners();
    loadUserData();
});

/**
 * Initialize the application
 */
function initializeApp() {
    console.log('Initializing Clinic Digital App...');
    
    // Set minimum date to today
    const today = new Date().toISOString().split('T')[0];
    const dateInput = document.getElementById('appointment-date');
    if (dateInput) {
        dateInput.min = today;
    }

    // Load therapists
    loadTherapists();

    // Check API health
    checkAPIHealth();
}

/**
 * Set up event listeners
 */
function setupEventListeners() {
    // Navigation
    const navLinks = document.querySelectorAll('.nav-link');
    navLinks.forEach(link => {
        link.addEventListener('click', (e) => {
            e.preventDefault();
            const targetId = link.getAttribute('href').substring(1);
            showSection(targetId);
            updateActiveNavLink(link);
        });
    });

    // Hamburger menu
    const hamburger = document.querySelector('.hamburger');
    const navMenu = document.querySelector('.nav-menu');
    if (hamburger) {
        hamburger.addEventListener('click', () => {
            navMenu.classList.toggle('active');
        });
    }

    // Forms
    const appointmentForm = document.getElementById('appointment-form');
    if (appointmentForm) {
        appointmentForm.addEventListener('submit', handleAppointmentSubmit);
    }

    const profileForm = document.getElementById('profile-form');
    if (profileForm) {
        profileForm.addEventListener('submit', handleProfileSubmit);
    }
}

/**
 * Show a specific section
 */
function showSection(sectionId) {
    // Hide all sections
    const sections = document.querySelectorAll('.section');
    sections.forEach(section => {
        section.classList.remove('active');
    });

    // Show the selected section
    const selectedSection = document.getElementById(sectionId);
    if (selectedSection) {
        selectedSection.classList.add('active');
        
        // Close mobile menu
        const navMenu = document.querySelector('.nav-menu');
        if (navMenu) {
            navMenu.classList.remove('active');
        }

        // Load section-specific data
        if (sectionId === 'appointments') {
            loadAppointments();
        } else if (sectionId === 'profile') {
            loadProfileForm();
        }
    }

    // Scroll to top
    window.scrollTo(0, 0);
}

/**
 * Update active navigation link
 */
function updateActiveNavLink(activeLink) {
    const navLinks = document.querySelectorAll('.nav-link');
    navLinks.forEach(link => {
        link.classList.remove('active');
    });
    activeLink.classList.add('active');
}

/**
 * Load user data from localStorage or API
 */
async function loadUserData() {
    const userId = localStorage.getItem('userId');
    
    if (userId) {
        const response = await makeRequest(() => apiClient.patients.get(userId));
        if (response.success) {
            currentUser = response.patient;
            displayUserInfo();
        }
    }
}

/**
 * Display user information in UI
 */
function displayUserInfo() {
    if (currentUser) {
        const nameElement = document.getElementById('patient-name');
        if (nameElement) {
            nameElement.textContent = `Bienvenido, ${currentUser.name}`;
        }

        // Load profile form with user data
        loadProfileForm();
    }
}

/**
 * Load therapists list
 */
async function loadTherapists() {
    const response = await makeRequest(() => apiClient.therapists.list());
    
    if (response.success && response.therapists) {
        const select = document.getElementById('therapist');
        if (select) {
            response.therapists.forEach(therapist => {
                const option = document.createElement('option');
                option.value = therapist.id;
                option.textContent = `${therapist.name} - ${therapist.specialization || 'Terapeuta'}`;
                select.appendChild(option);
            });
        }
    }
}

/**
 * Handle appointment form submission
 */
async function handleAppointmentSubmit(e) {
    e.preventDefault();

    const appointmentData = {
        patient_id: currentUser?.id || 1,
        therapist_id: parseInt(document.getElementById('therapist').value),
        scheduled_time: new Date(`${document.getElementById('appointment-date').value}T${document.getElementById('appointment-time').value}`).toISOString(),
        duration: 60,
        notes: document.getElementById('notes').value
    };

    const response = await makeRequest(() => apiClient.appointments.create(appointmentData));

    if (response.success) {
        showAlert('Cita agendada exitosamente', 'success');
        e.target.reset();
        setTimeout(() => showSection('appointments'), 1500);
    } else {
        showAlert('Error al agendar la cita: ' + (response.error || 'Unknown error'), 'error');
    }
}

/**
 * Load appointments
 */
async function loadAppointments() {
    const appointmentsList = document.getElementById('appointments-list');
    if (!appointmentsList) return;

    appointmentsList.innerHTML = '<div class="spinner"></div> Cargando citas...';

    const response = await makeRequest(() => 
        apiClient.appointments.list({ patient_id: currentUser?.id })
    );

    appointmentsList.innerHTML = '';

    if (response.success && response.appointments && response.appointments.length > 0) {
        response.appointments.forEach(appointment => {
            const card = createAppointmentCard(appointment);
            appointmentsList.appendChild(card);
        });
    } else {
        appointmentsList.innerHTML = '<p class="text-center">No tienes citas agendadas.</p>';
    }
}

/**
 * Create appointment card element
 */
function createAppointmentCard(appointment) {
    const div = document.createElement('div');
    div.className = 'appointment-card';
    
    const appointmentDate = new Date(appointment.scheduled_time);
    const formattedDate = appointmentDate.toLocaleDateString('es-MX');
    const formattedTime = appointmentDate.toLocaleTimeString('es-MX', { 
        hour: '2-digit', 
        minute: '2-digit' 
    });

    const statusClass = `status-${appointment.status}`;
    
    div.innerHTML = `
        <div class="appointment-time">${formattedTime}</div>
        <div class="appointment-info">
            <strong>Fecha:</strong> ${formattedDate}
        </div>
        <div class="appointment-info">
            <strong>Tipo:</strong> ${appointment.type || 'Cita general'}
        </div>
        <div class="appointment-info">
            <strong>Duración:</strong> ${appointment.duration} minutos
        </div>
        ${appointment.notes ? `<div class="appointment-info"><strong>Notas:</strong> ${appointment.notes}</div>` : ''}
        <span class="appointment-status ${statusClass}">${appointment.status}</span>
        <div class="btn-group mt-3">
            <button class="btn btn-warning" onclick="rescheduleAppointment(${appointment.id})">
                <i class="fas fa-edit"></i> Reagendar
            </button>
            <button class="btn btn-danger" onclick="cancelAppointment(${appointment.id})">
                <i class="fas fa-times"></i> Cancelar
            </button>
        </div>
    `;

    return div;
}

/**
 * Reschedule appointment
 */
async function rescheduleAppointment(appointmentId) {
    const newDate = prompt('Ingresa la nueva fecha (YYYY-MM-DD):');
    const newTime = prompt('Ingresa la nueva hora (HH:MM):');

    if (!newDate || !newTime) return;

    const newDateTime = new Date(`${newDate}T${newTime}`).toISOString();
    const response = await makeRequest(() => 
        apiClient.appointments.reschedule(appointmentId, { scheduled_time: newDateTime })
    );

    if (response.success) {
        showAlert('Cita reagendada exitosamente', 'success');
        loadAppointments();
    } else {
        showAlert('Error al reagendar la cita', 'error');
    }
}

/**
 * Cancel appointment
 */
async function cancelAppointment(appointmentId) {
    if (!confirm('¿Deseas cancelar esta cita?')) return;

    const response = await makeRequest(() => apiClient.appointments.cancel(appointmentId));

    if (response.success) {
        showAlert('Cita cancelada exitosamente', 'success');
        loadAppointments();
    } else {
        showAlert('Error al cancelar la cita', 'error');
    }
}

/**
 * Load profile form with user data
 */
function loadProfileForm() {
    if (currentUser) {
        document.getElementById('full-name').value = currentUser.name || '';
        document.getElementById('email').value = currentUser.email || '';
        document.getElementById('phone').value = currentUser.phone || '';
        document.getElementById('whatsapp').value = currentUser.whatsapp || '';
        document.getElementById('id-number').value = currentUser.id_number || '';
    }
}

/**
 * Handle profile form submission
 */
async function handleProfileSubmit(e) {
    e.preventDefault();

    const profileData = {
        name: document.getElementById('full-name').value,
        email: document.getElementById('email').value,
        phone: document.getElementById('phone').value,
        whatsapp: document.getElementById('whatsapp').value,
        id_number: document.getElementById('id-number').value
    };

    const userId = currentUser?.id || localStorage.getItem('userId');
    
    if (!userId) {
        // Register new patient
        const response = await makeRequest(() => apiClient.patients.register(profileData));
        if (response.success) {
            currentUser = response.patient;
            localStorage.setItem('userId', response.patient.id);
            showAlert('Perfil registrado exitosamente', 'success');
            displayUserInfo();
        } else {
            showAlert('Error al registrar el perfil', 'error');
        }
    } else {
        // Update existing patient
        const response = await makeRequest(() => apiClient.patients.update(userId, profileData));
        if (response.success) {
            currentUser = response.patient;
            showAlert('Perfil actualizado exitosamente', 'success');
        } else {
            showAlert('Error al actualizar el perfil', 'error');
        }
    }
}

/**
 * Check API health
 */
async function checkAPIHealth() {
    const health = await makeRequest(() => apiClient.health());
    if (health.status === 'error') {
        console.warn('Backend API is not available. Using demo mode.');
        showAlert('Nota: Funcionando en modo demo sin conexión al servidor', 'warning');
    }
}

/**
 * Show alert message
 */
function showAlert(message, type = 'info') {
    const alertDiv = document.createElement('div');
    alertDiv.className = `alert alert-${type}`;
    alertDiv.innerHTML = `
        <strong>${type === 'success' ? 'Éxito' : type === 'error' ? 'Error' : 'Información'}:</strong> ${message}
    `;

    const mainContent = document.querySelector('.main-content');
    mainContent.insertBefore(alertDiv, mainContent.firstChild);

    setTimeout(() => {
        alertDiv.remove();
    }, 5000);
}

// Global functions for onclick handlers
window.showSection = showSection;
window.rescheduleAppointment = rescheduleAppointment;
window.cancelAppointment = cancelAppointment;
