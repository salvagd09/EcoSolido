USE EcoSolido;

-- Agregar columna de correo electrónico
ALTER TABLE usuario ADD COLUMN correo_electronico VARCHAR(500) NOT NULL;

-- Agregar columna para respuesta de pregunta de seguridad
ALTER TABLE usuario ADD COLUMN respuesta_pregunta TEXT NOT NULL;

-- Agregar restricciones UNIQUE
ALTER TABLE usuario ADD UNIQUE(nombre_usuario);
ALTER TABLE usuario ADD UNIQUE(contrasena);
ALTER TABLE usuario MODIFY rol VARCHAR(20) NOT NULL;
ALTER TABLE usuario RENAME COLUMN  dni TO ruc;
ALTER TABLE usuario MODIFY COLUMN ruc CHAR(11);
ALTER TABLE usuario ADD COLUMN razon_social VARCHAR(255);
-- Verificar cambios
SELECT * FROM usuario;
SELECT * FROM incidencia;
SELECT * FROM incidencia_foto;
SELECT 
    CONSTRAINT_NAME, 
    CONSTRAINT_TYPE
FROM 
    INFORMATION_SCHEMA.TABLE_CONSTRAINTS
WHERE 
    TABLE_SCHEMA = 'ecosolido'
    AND TABLE_NAME = 'usuario'; 
ALTER TABLE usuario DROP INDEX contrasena;
ALTER TABLE usuario ADD COLUMN giro VARCHAR(30);
ALTER TABLE usuario ADD COLUMN latitud double;
ALTER TABLE usuario ADD COLUMN longitud double;
ALTER TABLE usuario ADD COLUMN direccion_texto VARCHAR(255);
SELECT ruc, COUNT(*) FROM usuario
WHERE ruc IS NOT NULL
GROUP BY ruc HAVING COUNT(*) > 1;
ALTER TABLE usuario ADD CONSTRAINT uq_usuario_ruc UNIQUE (ruc);
