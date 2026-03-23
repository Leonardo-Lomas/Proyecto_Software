# 📌 Especificación del Sistema de Agenda Terapéutica

## Requisitos Funcionales

### **RF-01: Concertación Multicanal de Citas (Web y WhatsApp)**
El sistema deberá facultar a los usuarios previamente autenticados para concertar citas terapéuticas mediante los canales habilitados (Web y WhatsApp).  
- El flujo de concertación contemplará la elección del profesional por parte del usuario o, en su defecto, la asignación automática conforme a la disponibilidad.  
- Se garantizará la coherencia y sincronización de la información entre ambos canales.

**Caso de Uso CU-01: Concertar cita multicanal**  
- **Actor:** Usuario autenticado  
- **Flujo:** Acceso → Selección de opción → Elección de fecha/hora/profesional → Confirmación → Emisión de comprobante.  
- **Postcondición:** La cita queda registrada en el repositorio central de datos.  

---

### **RF-02: Reprogramación de Citas**
El sistema deberá permitir la reprogramación de citas previamente registradas.  
- El administrador podrá efectuar esta acción en situaciones excepcionales (ej. ausencia del terapeuta).  
- El flujo solicitará la información mínima indispensable para validar la reprogramación.

**Caso de Uso CU-02: Reprogramar cita**  
- **Actor:** Usuario o administrador  
- **Flujo:** Solicita reprogramación → Sistema muestra alternativas → Selección → Actualización → Emisión de comprobante.  
- **Postcondición:** La cita queda registrada con nueva fecha y hora.  

---

### **RF-03: Sincronización de Disponibilidad en Tiempo Real**
El sistema deberá bloquear en tiempo real los horarios seleccionados durante el proceso de concertación o reprogramación, evitando la duplicidad de reservas (**double-booking**).  
- Se definirá el instante exacto de bloqueo (selección vs confirmación final).

**Caso de Uso CU-03: Bloqueo de horario en tiempo real**  
- **Actor:** Usuario autenticado  
- **Flujo:** Selección de horario → Bloqueo temporal → Confirmación → Bloqueo definitivo.  
- **Postcondición:** El horario queda reservado de manera exclusiva.  

---

### **RF-04: Generación de Comprobante de Cita**
El sistema deberá emitir un comprobante digital tras la creación o reprogramación de una cita.  
- Datos: folio, terapeuta, tipología de sesión, fecha, hora y consultorio.  
- Disponible tanto en Web como en WhatsApp.

**Caso de Uso CU-04: Emitir comprobante de cita**  
- **Actor:** Usuario autenticado  
- **Flujo:** Confirmación de cita → Generación de comprobante → Entrega al usuario.  
- **Postcondición:** El usuario recibe constancia oficial de su cita.  

---

## 📱 Módulo WhatsApp

### **RF-W01: Concertación de citas vía chatbot**
El chatbot deberá permitir la concertación de citas mediante un flujo conversacional estructurado: fecha → horarios → selección → datos → confirmación.

**Caso de Uso CU-W01: Concertar cita vía chatbot**  
- **Actor:** Usuario (nuevo o recurrente)  
- **Flujo:** Fecha → Horarios → Selección → Datos → Confirmación → Comprobante.  

---

### **RF-W02: Reprogramación de citas vía chatbot**
El chatbot deberá permitir la reprogramación de citas mostrando horarios disponibles.

**Caso de Uso CU-W02: Reprogramar cita vía chatbot**  
- **Actor:** Usuario  
- **Flujo:** Solicita reprogramar → Nueva fecha → Horarios → Selección → Confirmación → Comprobante.  

---

## Requisitos No Funcionales

### **RNF-01: Privacidad y Seguridad de Datos**
El sistema deberá cumplir con normativas de protección de datos médicos, evitando el almacenamiento de información sensible en registros temporales.

**Caso de Uso CU-NF01: Protección de datos sensibles**  
- **Actor:** Sistema  
- **Flujo:** Evita almacenamiento temporal → Cumple normativas.  

---

### **RNF-02: Usabilidad del Chatbot**
El flujo conversacional deberá ser intuitivo, con opciones enumeradas y mínima escritura libre.

**Caso de Uso CU-NF02: Interacción simplificada**  
- **Actor:** Usuario  
- **Flujo:** Interacción con opciones → Minimiza errores.  

---

### **RNF-03: Disponibilidad**
El sistema deberá garantizar disponibilidad continua (**24/7**) con mecanismos de respaldo.

**Caso de Uso CU-NF03: Acceso permanente**  
- **Actor:** Usuario  
- **Flujo:** Accede en cualquier momento → Sistema responde sin interrupciones.  

---

### **RNF-04: Identificación sin inicio de sesión**
El sistema deberá permitir la verificación de identidad mediante código enviado por WhatsApp.

**Caso de Uso CU-NF04: Verificación vía código WhatsApp**  
- **Actor:** Usuario  
- **Flujo:** Sistema envía código → Usuario ingresa → Validación → Acceso a citas.  

---

### **RNF-05: Visualización de citas venideras**
El sistema deberá mostrar la información de la cita programada (fecha, hora, nombre del paciente y motivo de consulta) de manera clara y correcta.

**Casl de Uso CU-NF04: Visualizacón de cita**

- **Actor:** Usuario.
- **Flujo:** Usuario accede al sistema → Sistema muestra la información de la cita.