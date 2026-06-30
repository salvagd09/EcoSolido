USE EcoSolido;

-- Agregar columna de correo electrónico
ALTER TABLE usuario ADD COLUMN correo_electronico VARCHAR(500) NOT NULL;

-- Agregar columna para respuesta de pregunta de seguridad
ALTER TABLE usuario ADD COLUMN respuesta_pregunta TEXT NOT NULL;

-- Agregar restricciones UNIQUE
ALTER TABLE usuario ADD UNIQUE(nombre_usuario);
ALTER TABLE usuario ADD UNIQUE(contrasena);

-- Verificar cambios
SELECT * FROM usuario;
SELECT * FROM incidencia;
SELECT * FROM incidencia_foto;