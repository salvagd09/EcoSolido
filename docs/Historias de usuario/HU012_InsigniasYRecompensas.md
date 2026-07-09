# Historia de Usuario HU012

## Título
Ver insignias obtenidas y recompensas asociadas

## Descripción
**Como** ciudadano,  
**necesito** ver las insignias obtenidas y las recompensas asociadas que ofrece la municipalidad,  
**para** sentirme motivado a seguir registrando incidencias y poder canjear los beneficios que he ganado.

## Criterios de Aceptación (Formato BDD)

### Escenario 1: Ciudadano visualiza insignias desbloqueadas
- **GIVEN** El ciudadano ha iniciado sesión y ha alcanzado los requisitos para obtener al menos una insignia.
- **WHEN** Accede a la sección "Mis insignias" en el módulo de recompensas al ciudadano.
- **THEN** El sistema muestra todas las insignias desbloqueadas con su nombre y descripción, indicando lo que le permitió obtener cada una.

### Escenario 2: Ciudadano visualiza insignias pendientes por desbloquear
- **GIVEN** El ciudadano ha iniciado sesión y existen insignias que aún no ha obtenido.
- **WHEN** Accede a la sección "Mis insignias" dentro del módulo de recompensas al ciudadano.
- **THEN** El sistema muestra las insignias bloqueadas e indica los requisitos necesarios para desbloquearlas.

### Escenario 3: Ciudadano obtiene una nueva insignia tras registrar una incidencia
- **GIVEN** El ciudadano registra una incidencia y con ello cumple los requisitos para obtener una nueva insignia.
- **WHEN** El sistema procesa el registro y evalúa los logros del ciudadano.
- **THEN** El sistema desbloquea automáticamente la insignia alcanzada y muestra una notificación de felicitación, indicando que ya puede visualizarla y canjear los beneficios asociados.

## Notas
- Las insignias se evalúan automáticamente al registrar una incidencia.
- Cada insignia tiene requisitos claros basados en cantidad de incidencias registradas.
- Las recompensas asociadas se muestran junto a cada insignia desbloqueada.
