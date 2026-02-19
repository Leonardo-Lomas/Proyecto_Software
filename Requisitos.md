# Diseño de Software

## Sistema de citas por medio del WhatsApp y Web

Es un sistema de agendamiento de citas y reprogramación de estas, con un enfoque en el uso de la API de WhatsApp para poder mandar notificaciones, agendar y reprogramar todo desde WhatsApp. También está el sistema en la parte web.

---

## Requerimientos Funcionales

### RF-01: Agendamiento Multicanal (Web y WhatsApp)
El sistema debe permitir a usuarios verificados agendar nuevas citas en el Sistema de Citas.  

**Editado:** El sistema debe otorgar la facultad de agendar citas terapéuticas a los usuarios previamente verificados en el sistema, a través de los canales disponibles (Web y WhatsApp).  

*(Pendiente: definir si el usuario escoge psicólogo o se asigna automáticamente)*

---

### RF-02: Visualización de citas futuras
El usuario debe poder visualizar cuándo es su próxima cita.  

**Editado:** El sistema debe otorgar al usuario una vista de sus próximas citas terapéuticas, mostrando detalles relevantes de cada cita.  

*(Pendiente: definir qué información se mostrará y cómo se presentará)*

---

### RF-03: Reprogramación de citas
En caso de que el usuario ya tenga una cita agendada, el sistema debe permitirle reagendar la cita a otro día y hora disponible.  

**Editado:** El sistema debe permitir a los usuarios reagendar sus citas terapéuticas previamente registradas. El administrador también debe poder realizar esta acción en casos pertinentes.  

*(Pendiente: definir qué información se solicita al usuario)*

---

### RF-04: Sincronización de disponibilidad en tiempo real
Al momento de agendar o reagendar una cita, el sistema debe bloquear en la base de datos el horario seleccionado por el usuario, impidiendo que este sea seleccionado por otro usuario y evitando el double-booking.  

**Editado:** Durante el proceso de selección de horario de la cita terapéutica, el sistema debe impedir que otros usuarios seleccionen la fecha previamente elegida por el usuario en proceso de agendamiento.  

*(Pendiente: definir si se bloquea al seleccionar o al confirmar la cita)*

---

### RF-05: Generación de comprobante de cita
Después de que se agende o reagende una cita, se debe proporcionar al usuario un resumen de la transacción.  

**Editado:** Posterior a la generación o reprogramación de una cita, se debe proporcionar al usuario un comprobante con los datos relevantes:  
- Número de folio  
- Nombre del terapeuta asignado  
- Tipo de sesión terapéutica  
- Fecha (dd/mm/yyyy)  
- Hora (formato 12 horas)  
- Ubicación del consultorio  

---

## Web
- RF: Agendamiento de citas  
- RF: Visualización de citas  
- RF: Reprogramación de citas  

---

## WhatsApp

### RF: Agendamiento de citas
El sistema debe permitir al usuario agendar citas.  

**Flujo:**  
1. Se pide al usuario el día en formato DD/MM/AAAA.  
2. Se muestran horarios disponibles en lista numérica.  
   - Ejemplo:  
     - 9:00 AM  
     - 10:00 AM  
     - 12:00 PM  
3. El usuario elige la hora ingresando el número correspondiente.  
4. Se solicitan los siguientes datos:  
   - Nombre completo  
   - Teléfono  
   - Motivo de la consulta (opcional)  

*(Pendiente: definir si el usuario escoge psicólogo o se asigna automáticamente)*

---

### RF: Visualización de citas futuras
El chatbot debe mostrar al usuario cuándo será su próxima cita y ofrecer opciones de reprogramación o cancelación.  

*(Pendiente: definir si se muestra en texto o imagen)*

---

### RF: Reprogramación de citas
El chatbot debe permitir reprogramar una cita existente a otro día y hora disponible, mostrando lista de horarios para el día elegido.  

---

## Requerimientos No Funcionales

### RNF: Privacidad y seguridad de datos
El sistema no debe almacenar datos sensibles en registros temporales, cumpliendo normativas de protección de datos médicos.  

### RNF: Usabilidad del Chatbot
El flujo de conversación en WhatsApp debe diseñarse con pocas opciones enumeradas, minimizando la escritura libre.  

### RNF: Disponibilidad
El módulo de agenda debe garantizar disponibilidad 24/7.  

### RNF: Identificación sin inicio de sesión
Se envía un código por WhatsApp o SMS al número de celular para verificar identidad y presentar las citas asociadas.  
