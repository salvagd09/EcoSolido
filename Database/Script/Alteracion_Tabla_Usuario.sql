Use EcoSolido;
ALTER TABLE usuario ADD COLUMN correo_electronico VARCHAR(500) NOT NULL;
ALTER TABLE usuario ADD COLUMN respuesta_pregunta TEXT NOT NULL;
Select * from usuario;