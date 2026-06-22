Use EcoSolido;
ALTER TABLE usuario ADD COLUMN correo_electronico VARCHAR(500) NOT NULL;
ALTER TABLE usuario ADD COLUMN respuesta_pregunta TEXT NOT NULL;
ALTER TABLE usuario ADD UNIQUE(nombre_usuario);
ALTER TABLE usuario ADD UNIQUE(contrasena);
Select * from usuario;
SELECT * FROM incidencia;
SELECT * FROM incidencia_foto;