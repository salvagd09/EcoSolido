USE ecosolido;
ALTER TABLE incidencia 
MODIFY estado ENUM('PENDIENTE','EN_PROCESO','RESUELTO') DEFAULT 'PENDIENTE';
ALTER TABLE incidencia
ADD CONSTRAINT chk_estado CHECK (estado IN ('PENDIENTE', 'EN_PROCESO', 'RESUELTO'));
ALTER TABLE incidencia ADD COLUMN titulo VARCHAR(150);
ALTER TABLE incidencia 
ADD COLUMN latitud DECIMAL(10,8),
ADD COLUMN longitud DECIMAL(10,8),
ADD COLUMN direccion_texto VARCHAR(1000);

-- HU011: Sistema de puntos por incidencia
ALTER TABLE usuario ADD COLUMN puntos INT DEFAULT 0;
