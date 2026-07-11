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

-- HU012: Sistema de insignias y recompensas
CREATE TABLE IF NOT EXISTS insignia (
    id_insignia INT AUTO_INCREMENT PRIMARY KEY,
    nombre VARCHAR(100) NOT NULL UNIQUE,
    descripcion VARCHAR(1000) NOT NULL,
    icono VARCHAR(50) NOT NULL,
    requisito_incidencias INT NOT NULL,
    recompensa VARCHAR(500)
);

CREATE TABLE IF NOT EXISTS usuario_insignia (
    id_usuario_insignia INT AUTO_INCREMENT PRIMARY KEY,
    id_usuario BIGINT NOT NULL,
    id_insignia INT NOT NULL,
    fecha_desbloqueo DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    UNIQUE KEY uk_usuario_insignia (id_usuario, id_insignia),
    FOREIGN KEY (id_usuario) REFERENCES usuario(id_usuario),
    FOREIGN KEY (id_insignia) REFERENCES insignia(id_insignia)
);
