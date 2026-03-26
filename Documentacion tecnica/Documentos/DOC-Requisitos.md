# Especificaciónes de Requisitos del Sistema de Agendamiento de Citas Terapéuticas

## Requisitos Funcionales

### **RF-01: Programación Multicanal de Citas (Web y WhatsApp)**
El sistema deberá facultar a los usuarios previamente autenticados para programar citas terapéuticas mediante los canales habilitados (Web y WhatsApp).  
- El flujo de concertación contemplará la elección del profesional por parte del usuario o, en su defecto, la asignación automática conforme a la disponibilidad.  
- Se garantizará la coherencia y sincronización de la información entre ambos canales, evitando duplicidades o incosistencias.

**Caso de Uso CU-01: Programar cita multicanal**  
- **Actor:** Usuario autenticado  
- **Flujo:** Acceso → Selección de opción → Elección de fecha/hora/profesional → Confirmación → Emisión de comprobante.  
- **Postcondición:** La cita queda registrada en el repositorio central de datos (base de datos).  

---

### **RF-02: Consulta de citas**
El sistema debe permitirle al usuario consultar su proxima cita, el comprobante y informacion de la misma, en la que se incluye: paciente, tipología de sesión,
fecha, hora, consultorio asignado, nombre del terapeuta y el estado de la cita

**Caso de Uso CU-02: Consulta de citas**  
- **Actor:** Usuario autenticado  
- **Flujo:** Solicita consulta → Sistema proporciona informacion y comprobante de cita proxima
- **Postcondición:** El usuario visualiza sus compromisos confirmados.

---

### **RF-03: Reprogramación de Citas**
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

### **RF-W01: Programacion de citas vía chatbot**
El chatbot deberá permitir la programacion de citas mediante un flujo conversacional estructurado: fecha → horarios → selección → datos → confirmación.

**Caso de Uso CU-W01: programacion cita vía chatbot**  
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

### **RNF-01: Integridad de la informacion**
El sistema deberá garantizar que la información mostrada en consultas, comprobantes y notificaciones coincida exactamente con la registrada en la base de datos.

**Actores involucrados:**
- Sistema

**Flujo principal:**
1. El sistema accede a la base de datos
2. El sistema valida que la informacion mostrada al usuario sea la misma que aparece en la base de datos.

**Postcondicion:** La informacion presentada al usuario es la registrada en la base de datos

**Criterios de aceptacion:**
- Los datos de la cita mostrados coinciden con los registrados en la base de datos.
- La informacion de la base de datos esta actualizada con cada accion (agendamiento y reprogramacion).
- La informacion debe de estar sincronizada con cada operacion.

**Restricciones:**
- Toda informacion mostrada debe de estar previamente en la base de datos.
- No se permite mostrar informacion desactualizada.

**RFN relacionados:**
- RF-01
- RF-02
- RF-03
- RF-04

### **RNF-02: Usabilidad del Chatbot (WhatsApp)**
El flujo conversacional del chatbot le permitira al usuario poder usarlo sin necesidad de ayuda externa, priorizando un diseño intuitivo y de facil seguimiento.

**Actores involucrados:**
- Usuario
- Sistema (WhatsApp)

**Flujo principal:**
1. El usuario entra al WhatsApp
2. El Chatbot orienta al usuario por medio de mensajes claros y predefinidos.

**Postcondicion:** El usuario completa el flujo del servicio seleccionado

**Criterios de Aceptacion:**
- Los mensajes son breves y con claridad.
- El flujo no es extenso ni arduio.
- El chatbot esta hecho por medio de menus desplegables (botones).
- Conversaciones predefinidas.
- Diseño intuitivo.

**Restricciones:**
- Unicamente estara disponible en español
- No debe solicitar informacion sensible.

---

### **RNF-03: Identificacion sin Inicio de sesion**
Permite que el usuario sea identificado automáticamente en WhatsApp/Web mediante su número telefónico, sin necesidad de login adicional.

**Actores involucrados:**
- Usuario
- Sistema

**Flujo principal:**
1. El sistema identifica al usuario por su número telefónico registrado.
2. Valida contra la base de datos sin login adicional, localizando al usuario.

**Postcondición:** El usuario accede a sus citas desde WhatsApp/Web con su numero telefonico.

**Criterios de Aceptacion:**
- El sistema reconoce al usuario por número único.
- No se permite acceso si el número no está registrado.

**Restricciones:**
- Aplica en ambos modulos (Web/WhatsApp).
- Solo se permite un usuario por numero telefonico.


### **RNF-04: Visualizacion de Citas proximas**
Se muestra la informacion de la cita proxima previamente agendada en el sistema.

**Actores involucrados:**
- Usuario
- Sistema

**Flujo principal:**
1. El usuario solicita la informacion de su cita.
2. El sistema genera la previsualizacion de la informacion.
3. El sistema recupera/genera el comprobante y se lo muestra al usuario.

**Caso de Uso CU-NF04: Verificación vía código WhatsApp**  
- **Actor:** Usuario  
- **Flujo:** Sistema envía código → Usuario ingresa → Validación → Acceso a citas.  

---

### **RNF-05: Visualización de citas venideras**
El sistema deberá mostrar la información de la cita programada (fecha, hora, nombre del paciente y motivo de consulta) de manera clara y correcta.

**Caso de Uso CU-NF05: Visualizacón de cita**

- **Actor:** Usuario.
- **Flujo:** Usuario accede al sistema → Sistema muestra la información de la cita.