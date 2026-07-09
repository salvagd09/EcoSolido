# Historia de Usuario HU011

## Título
Ganar puntos automáticamente al registrar una incidencia

## Descripción
**Como** ciudadano,  
**quiero** ganar puntos automáticamente cada vez que registro una incidencia,  
**para** sentirme motivado a seguir reportando problemas en mi zona.

## Criterios de Aceptación (Formato BDD)

### Escenario 1: Asignación de puntos por registro exitoso
- **GIVEN** que el ciudadano ha completado y enviado correctamente una incidencia según la HU014.
- **WHEN** el sistema confirma el registro de la incidencia.
- **THEN** el sistema asigna automáticamente los puntos correspondientes y notifica al ciudadano la cantidad de puntos ganados.

### Escenario 2: Visualización inmediata de los puntos
- **GIVEN** que el ciudadano acaba de registrar una incidencia y el sistema le asignó puntos.
- **WHEN** el ciudadano accede a su perfil o a la sección "Mis puntos".
- **THEN** el total de puntos mostrado incluye los puntos recién ganados.

### Escenario 3: Incidencia duplicada no genera puntos adicionales
- **GIVEN** que el ciudadano intenta registrar una incidencia idéntica a una ya reportada por él.
- **WHEN** el sistema detecta la duplicidad y rechaza el registro.
- **THEN** no se asignan puntos adicionales y el sistema notifica que la incidencia ya fue registrada.

## Notas
- Los puntos asignados deben reflejarse de forma inmediata en el perfil del ciudadano.
- El sistema debe evitar la gamificación abusiva mediante la validación de incidencias duplicadas.
