# Especificaciónes de Requisitos del Sistema de Agendamiento de Citas Terapéuticas

## Requisitos Funcionales

### **RF-01: Programación Multicanal de Citas (Web y WhatsApp)**

El sistema debe permitir a los usuarios previamente autenticados programar citas terapéuticas mediante los canales habilitados (Web y WhatsApp), cumpliendo con un flujo principal de registro de datos.

**Actores involucrados:**
- Usuario 
- Sistema (Web/WhatsApp)

**Flujo principal:**
1. Eleccion de servicio (agendamiento de cita).
2. Eleccion del Terapeuta.
3. El sistema busca la disponibilidad de fechas y horarios a mostrar en base al terapeuta seleccionado.
4. Seleccion de la fecha.
5. Seleccion del horario.
6. Confirmacion de los datos.
7. Se emite una previsualizacion de los datos de la cita agendada.
8. Emision del comprobante.

La eleccion del terapeuta, involucra que se desplieguen las **fechas**, **horarios disponibles** y **consultorio** para agendar con dicho terapeuta.

**Postcondición:** La cita queda registrada en el repositorio central de datos (base de datos).  

**Criterios de Aceptacion:**
- La cita debe de quedar registrada en la base de datos.
- Se debe de emitir el comprobante con los datos previamente aceptados por el usuario.
- El sistema le asigna un consultorio valido al usuario (por ver si es automatico o el consultorio es por terapeuta).
- La aceptacion de la cita debe contener una previsualizacion de los datos de la cita obtenidos del usuario.
- Solo se permite tener una cita agendada en el sistema por usuario, no se permite un agendamiento multiple.

**Restricciones**:
- La seleccion de la fecha estara limita a 7 dias habiles al momento de la consulta (regla de negocio por simplicidad).
- El horario de agendamiento es desde las 10:00 a.m - 6:00 p.m,
- Las fechas y horarios mostrados corresponden a la disponibilidad del terapeuta mostrado.
- Solo el usuario autenticado puede acceder al servicio.

---

### **RF-02: Consulta de citas**
El sistema debe permitirle al usuario consultar su proxima cita, mostrando los datos que la cita contiene.

**Actores involucrados:**
- Usuario
- Sistema (Web/WhatsApp)

**Flujo principal:**
1. Eleccion del servicio (visualización de cita).
2. El sistema consulta la informacion de la base de datos
3. Se muestra la informacion de la cita en un formato estandar.
4. Se le permite al usuario acceder la comprobante emitido previamente (cuando se agendo la cita).

**Postcondicion:** El usuario puede visualizar la informacion de su cita previamente agendada

**Criterios de Aceptacion:**
- La informacion mostrada coincide con la informacion de la cita registrada en la base de datos
- La informacion del comprobante es igual a la de la informacion emitida.

**Restricciones:**
- Unicamente se puede visualizar la informacion de la cita proxima (regla de negocio, no puede ver su historial previo).
- No se permite el acceso a la informacion de citas pasadas.
- No debe mostrarse informacion sensible.
- Solo el usuario autenticado puede acceder al servicio.
- La consulta unicamente es por medio de los canales oficiales (Web y WhatsApp).

---

### **RF-03: Reprogramación de Citas**
El sistema deberá permitir la reprogramación de citas previamente registradas en el sistema.  

**Actores involucrados:**
- Usuario autenticado.
- Administrador(en casos especiales).
- Sistema (Web/WhatsApp)

**Flujo principal:**
1. Eleccion del servicio (Reprogramacion de cita).
2. Muestra la informacion cita previamente registrada.
3. Se le solicita al usuario/administrador una confirmacion para reprogramar la cita.
4. Se solicita la nueva fecha de la cita.
5. Se solicita el nuevo horario de la cita.
6. Confirmacion de los datos.
7. Se emite una previsualizacion de los datos de la cita reprogramada.
8. Emision del comprobante.

La seleccion del terapeuta es inamovible, por lo cual solo se despliegan las fechas y horarios disponibles para el terapeuta

**Postcondicion:** La cita queda reprogramada en el sistema con los nuevos datos

**Criterios de Aceptacion:**
- La cita queda reprogramada en la base de datos
- La informacion emitida en el comprobante corresponde a los nuevos datos
- El administrador puede reprogramar una cita, avisando al usuario por el medio de contacto que su cita a sido reprogramada.

**Restricciones:**
- Solo el usuario autenticado puede acceder al servicio.
- Unicamente se puede alterar la fecha y hora.
- No es posible cambiar de terapeuta.
- Las fechas y horarios mostrados son los disponibles para el terapeuta seleccionado inicialmente.

---

### **RF-04: Generación de Comprobante de Cita**
El sistema deberá emitir un comprobante digital en formato PDF tras la creación de la cita y/o la reprogramacion de la cita.

**Actores Involucrados:**
- Usuario
- Sistema

**Flujo principal:**
1. El sistema genera el comprobante (en caso de ser agendamiento) o busca el comprobante generado para dicha cita (por medio de tecnologias externas se crea el comprobante).
3. El comprobante es enviado al usuario.

**Postcondicion:** El comprobante de la cita debe ser generado y estar accesible para su visualizacion

**Criterios de Aceptacion:**
- El comprobante debe de contener la informacion siguiente:
    - Fecha de la generacion del comprobante.
    - Nombre del paciente.
    - Nombre del terapeuta.
    - Fecha de la cita.
    - Hora de la cita.
    - Consultorio de la cita.
- Debe de ser emitido en un formato PDF.
- Debe de ser accesible posteriormente por medio de la opcion de visualizacion de cita.
- Debe contener un folio.
- La informacion debe ser exactamente la misma que esta registrada en la base de datos.

**Restricciones:**
- El comprobante no debe de incluir informacion medica sensible.
- Unicamente estara disponible por los medios canales oficiales habilitados (Web y WhatsApp).
- Un unico comprobante por cada cita registrada en la base de datos. 

---

### **RF-05: Autenticacion de Usuarios**
El sistema debe de permitir a los posibles usuarios autenticarse para poder acceder a los servicios que ofrece el sistema (agendamiento, reprogramacion y consulta).

**Actores involucrados:**
- Posible usuario
- Sistema

**Flujo principal:**
1. El usuario accede al sistema (Web).
2. Se solicita el llenado de un formulario con informacion basica.
3. El sistema envia la OTP al numero telefonico registrado.
4. El usuario ingresa la OTP enviada.
5. Sistema valida la OTP.
6. Se registra exitosamente.
7. Queda guardado el usuario con su informacion en la base de datos.
8. El usuario puede ingresar los servicios (Web/WhatsApp).

> OTP = One-Time-Password

**Postcondicion:** El usuario queda verificado para poder usar los servicios proveidos en los canales oficiales (Web/WhatsApp).

**Criterios de Aceptacion:**
- El sistema rechaza una OTP distinta a la enviada al numero telefonico.
- El usuario queda registrado en el sistema.
- Se permite el acceso a los servicios del sistema a los usuarios autenticados.
- Se rechazan OTP expiradas o invalidas.
- Se permite enviar una nueva OTP.
- El formulario de informacion basica debe de contener:
    - Nombre completo.
    - Numero telefonico.
    - Correo electronico (opcional).
    - Fecha de nacimiento.
    - Sexo (Masculino/Femenino).
    - Preferencia de contacto (en caso de tener el correo electronico llenado) WhatsApp o Correo Electronico.

**Restricciones:**
- La OTP enviada expira despues de un tiempo especifico (tentativamente 5 minutos).
- El numero telefonico queda asociado al usuario, este numero no puede estar vinculado a dos usuarios distintos.
- Solo se puede hacer la verificacion por el canal Web.
- En caso de acceder al modulo Web sin un numero autenticado, se mandara un enlace a la pagina web para poder registrarse y usar los servicios

---

### **RF-06: Notificaciones por medio de contacto (WhatsApp)**
El sistema debe enviar notificaciones por el medio de contacto especificado por el usuario, con dos posibles escenarios:
1. Recordatorio de la cita con un dia de anticipacion.
2. Recordatorio por repgrogramacion de cita realizada por un administrador.

**Actores involucrados:**
- Sistema
- Usuario

**Flujo principal:**
1. El sistema detecta una reprogramacion de la cita (hecho por un administrador) y/o la cita esta proxima (con un dia de anticipacion).
2. El sistema procesa la informacion de la notificacion con un formato estandarizado.
3. La notificacion es enviada al usuario por el medio de contacto especificado (WhatsApp).

**Postcondicion:** La notificacion es enviada al medio de contacto del usuario (WhatsApp).

**Criterios de Aceptacion:**
- El sistema envia la notificacion exitosamente.
- La informacion de la notificacion es correcta con respecto a la que esta en la base de datos.
- Se envia una notififacion por cada reprogramacion de la cita hecha por un administrador
- Se registra la fecha y hora del envio de la notificacion
- La informacion de la reprogramacion incluye la siguiente informacion:
    1. Nombre del paciente.
    2. Antiguia fecha y hora elegida.
    3. Nueva fecha y hora estipulada
    4. Mensaje de saludo y despedida (saludos, gracias por su atention).
    5. Acceso al comprobante.
    6. Explicacion del reagendamiento (mensaje corto y breve).
- La informacion de la cita proxima incluye la siguiente informacion:
    1. Nombre del paciente.
    2. Fecha y hora de la cita.
    3. Consultorio de la cita.
    4. Terapeuta asignado.
    5. Mensaje de saludo y despedida (breve).
    6. Mensaje "Su cita agendada {fecha y hora} esta proxima, acuda en tiempo y forma" (ejemplo).

**Restricciones:**
- no se envian multiples recordatorios de citas proximas.
- La notificacion solo puede ser enviada via WhatsApp.
- No se incluye ninguna informacion sensible en la informacion.
- Solo puede ocurrir el envio por un medio de contacto valido y registrado en el sistema.

---

## 📱 Módulo WhatsApp

### **RF-W01: Agendamiento de citas vía chatbot**
El chatbot deberá permitir el agendamiento de citas mediante un flujo conversacional estructurado, claro y breve.

**Actores involucrados:**
- Usuario
- Sistema (WhatsApp).

**Flujo principal:**
1. El usuario solicita agendar cita.
2. El chatbot muestra la lista de terapeutas disponibles.
3. El usuario selecciona terapeuta.
4. El chatbot consulta la disponibilidad del terapeuta y muestra fechas disponibles.
5. El usuario selecciona fecha.
6. El chatbot muestra horarios disponibles para esa fecha.
7. El usuario selecciona horario.
8. El chatbot solicita la confirmacion de los datos
9. El sistema registra la cita en la base de datos y genera comprobante.

**Postcondición:** La cita queda registrada en el repositorio central de datos (base de datos).  

**Criterios de Aceptacion:**
- El flujo no tiene un numero mayor a 7 pasos.
- Los mensajes son claros y en español.
- El comprobante se genera automáticamente tras la confirmación.

**Restricciones**:
- No se solicita información sensible.
- Solo usuarios autenticados pueden agendar.

### **RF-W02: Reprogramación de citas vía chatbot**
El chatbot debe permitir al usuario reprogramar citas previamente agendadas en el sistema.

**Actores involucrados:**
- Usuario
- Sistema (WhatsApp).

**Flujo principal:**
1- El usuario solicita reprogramar cita.
2- El chatbot muestra la cita actual registrada.
3- El usuario confirma la intención de reprogramar.
4- El chatbot consulta la disponibilidad del mismo terapeuta y muestra nuevas fechas.
5- El usuario selecciona fecha.
6- El chatbot muestra horarios disponibles para esa fecha.
7- El usuario selecciona horario.
8- Se pide la confirmacion del usuario para reagendar la cita con los nuevos datos.
8- El sistema actualiza la cita en la base de datos y genera comprobante actualizado.

**Postcondición:** La cita queda registrada en el repositorio central de datos (base de datos).  

**Criterios de Aceptacion:**
- El terapeuta no puede cambiarse.
- El comprobante actualizado se envía al usuario.
- La información mostrada coincide con la base de datos.

**Restricciones**:
- Solo usuarios autenticados pueden reprogramar.
- No se permite modificar datos distintos a fecha y hora.

---

### **RFW-03: Consulta de cita via Chatbot**
El chatbot debe permitir al usuario consultar su próxima cita mediante un flujo conversacional, mostrando la información registrada en la base de datos y el comprobante asociado.

**Actores involucrados:**
- Usuario.
- Sistema (WhatsApp).

**Flujo principal:**
1. El usuario solicita consultar su proxima cita.
2. El chatbot valida la identidad del usuario mediante su número telefónico registrado.
3. El sistema consulta la base de datos y obtiene la información de la cita próxima.
4. El chatbot muestra al usuario los datos de la cita en formato estandarizado (fecha, hora, terapeuta, consultorio).
5. El chatbot ofrece acceso al comprobante previamente emitido.

**Postcondición:** El usuario visualiza la información de su próxima cita y puede acceder al comprobante asociado.

**Criterios de Aceptacion:**
- La información mostrada coincide exactamente con la registrada en la base de datos.
- El comprobante accesible contiene los mismos datos que la cita registrada.
- El flujo conversacional es claro y no excede 5 pasos.
- No se muestra información sensible ni citas pasadas.

**Restricciones**:
- Solo usuarios autenticados pueden acceder a la consulta.
- La consulta se limita a la próxima cita registrada (no historial).

---
## Requisitos No Funcionales

### **RNF-01: Sincronización de la informacion** 

El sistema deberá garantizar que la información mostrada en consultas, comprobantes y notificaciones coincida exactamente con la registrada en la base de datos.

**Categoría de atributo de calidad de software:** Consistencia.

**Condiciones del sistema:** El sistema debe mantener la sincronización de la información con la base de datos bajo cualquier operación del usuario.

**Tecnica de comprobación:** 
- Pruebas de integración entre el frontend y la base de datos.
- Pruebas de consistencia de la informacion posteriormente al uso de operaciones (agendar y reprogramar cita).

**Criterio de aceptacion:**
- El 100% de la información mostrada al usuario debe coincidir con lo almacenado en la base de datos.
- No deben presentarse información desactualizada después de realizar una operación (tiempo de sincronización ≤ 1 segundo).

### **RNF-02: Chatbot facil de usar (WhatsApp)**
Categoria de atributo de calidad: Intuitividad

El chatbot es claro y facil de entender al guiar al usuario, limitando el numero de deciciones que el usuario debe tomar para asi evitar confusiones
y escenarios inesperados

**Condiciones del sistema:**
- El dialogo del chatbot es breve y no usa palabras complejas o poco conocidas
- Todas las opciones se le dan al usuario en botones y menus desplegables
- Los mensajes del chatbot estan predifinido

**Tecnica de comprobacion:**
**NOTA:**(Alparecer hay paginas que te dicen que tan usada es una palabra, no se si les parece bien usar eso)

- Comprobacion manual: Probar manualmente el flujo conversacional y verificar que cumpla los criterios de
  aceptacion

**Criterio de aceptacion:**
**NOTA:**(Si usamos una pagina como la que mencione antes, podemos poner que la pagina no marque las palabras como complicadas
o poco usadas)

- Ninguna opcion se elije, o decision se toma mediante otro medio que no sea un boton o menu desplegable
- Que los mensajes del chatbot no excedan los **(INSERTAR CANTIDAD)** caracteres
- Los mensajes del chatbot son siempre los mismos, exceptuando la informacion relacionada con la tarea que se esta
  haciendo

---

### **RNF-03: Identificacion sin Inicio de sesion**
Permite que el usuario sea identificado automáticamente en WhatsApp/Web mediante su número telefónico, sin necesidad de login adicional.

**Actores involucrados:**
- Usuario
- Sistema

**Condiciones del sistema**
-Durante cualquier solicitud de acceso o 
consulta en los módulos del sistema donde
se invoque el proceso de
identificaciónbasada en el 
número telefónico.

**Categoría de atributo de calidad de software**
-Seguridad (Autenticación, Integridad y Control de Acceso)

**Técnica de comprobación**
-Pruebas de seguridad de manipulación de parámetros y suplantación de identidad. Se utilizarán herramientas de intercepción de tráfico de red para capturar
la petición de identificación e intentar modificar manualmente el número telefónico enviado al backend, simulando el intento de un atacante de acceder a las 
citas de otro usuario.

**Criterios de Aceptacion:**
-El sistema debe bloquear y rechazar el 100% de las peticiones cuyo número telefónico haya sido alterado o carezca de la firma/token de validación del 
proveedor original (API de WhatsApp o Web).



### **RNF-04: Visualizacion de Citas proximas**
Se muestra la informacion de la cita proxima previamente agendada en el sistema.

**Actores involucrados:**
- Usuario
- Sistema

**Flujo principal:**
1. El usuario solicita la informacion de su cita.
2. El sistema genera la previsualizacion de la informacion.
3. El sistema recupera/genera el comprobante y se lo muestra al usuario.

**Postcondicion:** El usuario visualiza información de su cita próxima.

**Criterios de Aceptacion:**
- La información coincide con la registrada en la base de datos.
- La previsualizacion de la informacion es completa y legible
- Siempre debe de ser posible visualizar los datos de la cita

**Restricciones:**
- Solo usuarios autenticados pueden acceder a su informacion.

### **RNF-05: Seguridad de Datos**
El sistema debe proteger la información personal de los usuarios mediante cifrado, control de accesos y cumplimiento de normativas de protección de datos, garantizando que los datos no sean compartidos sin consentimiento.

**Categoría de atributo de calidad de software:** Seguridad (Confidencialidad, Integridad y Control de Acceso).

**Condiciones del sistema:** La información se transmite y almacena en la base de datos utilizando protocolos seguros de cifrado. El acceso a los datos está restringido únicamente a usuarios autenticados mediante OTP.

**Técnica de comprobación:** Pruebas de seguridad con herramientas de análisis de tráfico y auditorías de cumplimiento normativo. Se realizarán intentos de acceso no autorizado para verificar que el sistema rechaza dichas solicitudes.

**Criterios de Aceptacion:**
- La información llega cifrada a la base de datos.
- El sistema cumple con normativas de protección de datos aplicables (ej. GDPR, Ley Federal de Protección de Datos Personales en México).
- El sistema rechaza el 100% de accesos no autorizados.
- No se comparte información con terceros sin consentimiento explícito del usuario.

>OTP: One Time Password.

### **RNF-06: Facilidad de uso de la pagina web**
La interfaz web debe ser clara, responsiva y fácil de usar, permitiendo que los usuarios agenden, consulten y reprogramen citas sin dificultad, en un flujo breve y comprensible.

**Categoría de atributo de calidad de software:** Intuitividad y Accesibilidad.

**Condiciones del sistema:** El portal web debe funcionar correctamente en navegadores de escritorio, con formularios validados en tiempo real y un diseño responsivo que se adapte a diferentes resoluciones.

**Técnica de comprobación:** Pruebas de usabilidad con usuarios finales, midiendo el número de pasos requeridos para completar cada flujo y evaluando la claridad de los formularios.

**Criterios de Aceptacion:**
- Los usuarios completan las tareas sin necesidad de asistencia externa.
- La interfaz es responsiva en dispositivos de escritorio.
- El flujo de agendamiento, consulta y reprogramación no excede 7 pasos.
- Los formularios muestran validaciones inmediatas y mensajes claros en español.