# Requisitos Funcionales

## RF-01: Agendamiento Multicanal (Web y WhatsApp)
El sistema debe otorgar la facultad de agendar citas terapéuticas a los usuarios previamente verificados en el sistema, a través de los canales disponibles (Web y WhatsApp).

> (Hay que ver cómo funciona el sistema de agenda de citas de la facultad)  
> Ejemplo: ¿Se le deja escoger el psicólogo a los usuarios?, ¿o se les asigna automáticamente uno?

## RF-02: Visualización de citas futuras
El sistema debe otorgar al usuario una vista de sus próximas citas terapéuticas, mostrando los detalles de cada cita.

**Información obligatoria:**
- Nombre del paciente  
- Tipo de cita  
- Horario de la cita  
- Ubicación (# Consultorio)  

> (¿De qué manera se le mostrará?, ¿qué información adicional se le mostrará de la cita?)

## RF-03: Reprogramación de citas
El sistema debe permitir a los usuarios reagendar sus citas previamente registradas.  
El administrador también debe poder realizar esta acción en los casos pertinentes.

> (¿Información que se le solicita al usuario?)

## RF-05: Sincronización de disponibilidad en tiempo real
Al agendar o reagendar una cita, el sistema debe bloquear en la base de datos el horario seleccionado, evitando el **double-booking**.

Durante el proceso de selección de horario, el sistema debe impedir que otros usuarios seleccionen la fecha previamente elegida.

> (¿Se bloquea apenas lo selecciona?, ¿se bloquea una vez se agenda la cita?)

## RF-06: Generación de comprobante de cita
Posterior a la generación o reprogramación de una cita, se debe proporcionar al usuario un comprobante con los datos relevantes:

**Contenido del comprobante:**
- Número de folio  
- Nombre del terapeuta asignado  
- Tipo de sesión terapéutica  
- Fecha (dd/mm/yyyy)  
- Hora (formato 12 horas: 9 a.m. / 9 p.m.)  
- Ubicación del consultorio  

># Web
>
>- RF: Agendamiento de citas  
>- RF: Visualización de citas  
>- RF: Reprogramación de citas

# WhatsApp (Requisitos definidos para el módulo de WhatsApp)

## RF-W01: Agendamiento de citas
El sistema debe permitir al usuario agendar citas.

**Flujo:**
1. Se pide al usuario el día en formato DD/MM/AAAA (Ejemplo: 25/02/2026).  
2. Se muestran los horarios disponibles en lista numérica:  
   - 9:00 AM  
   - 10:00 AM  
   - 12:00 PM  
3. El usuario elige la hora ingresando el número correspondiente.  
4. Se solicitan los siguientes datos:  
   - Nombre completo (si es primera cita)  
   - Teléfono (posiblemente innecesario)  
   - Tipo de sesión  
   - Motivo de la consulta (opcional)  

> (Hay que ver cómo funciona el sistema de agenda de la facultad)  
> Nos falta el flujo de trabajo para usuarios nuevos y continuos.

## RF-W02: Visualización de citas futuras
Si existe una cita agendada, el chatbot debe mostrar la próxima cita y ofrecer opciones de reprogramación o cancelación.

> (¿Imagen? ¿Texto? ¿Cómo será la disposición de los elementos?)

## RF-W03: Reprogramación de citas
El chatbot debe permitir reprogramar una cita existente a otro día y hora disponible, mostrando lista de horarios para el día elegido.

---

# Requisitos No Funcionales

## RNF-01: Privacidad y seguridad de datos
El sistema no debe almacenar datos sensibles en registros temporales, cumpliendo normativas de protección de datos médicos.

## RNF-02: Usabilidad del Chatbot
El flujo de conversación en WhatsApp debe diseñarse con pocas opciones enumeradas, minimizando la escritura libre.

## RNF-03: Disponibilidad
El módulo de agenda debe garantizar disponibilidad **24/7**.

## RNF-04: Identificación sin inicio de sesión
Se envía un código por WhatsApp o SMS al número de celular para verificar identidad y presentar citas asociadas.
