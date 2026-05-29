USE EcoSolido;
Select * from incidencia;
Select * from incidencia_foto;
CREATE TABLE usuario (
    id          BIGINT AUTO_INCREMENT PRIMARY KEY,
    nombre_completo      VARCHAR(255) NOT NULL,
    apellido_completo VARCHAR(255) NOT NULL,
    dni CHAR(8) NOT NULL,
    telefono CHAR(9) NOT NULL,
    nombre_usuario VARCHAR(255) NOT NULL,
    contrasena    VARCHAR(255) NOT NULL,
    pregunta_seguridad TEXT NOT NULL
);
CREATE TABLE incidencia (
    id_incidencia   BIGINT AUTO_INCREMENT PRIMARY KEY, -- era "id"
    descripcion     TEXT NOT NULL,
    categoria       VARCHAR(100) NOT NULL,
    estado          VARCHAR(50) DEFAULT 'PENDIENTE',
    fecha           DATETIME DEFAULT CURRENT_TIMESTAMP,
    id_ciudadano    BIGINT,                            -- era "ciudadano_id"
    FOREIGN KEY (id_ciudadano) REFERENCES usuario(id)
);
CREATE TABLE incidencia_foto (                         -- era "incidenciaFoto"
    id_foto         BIGINT AUTO_INCREMENT PRIMARY KEY, -- era "id"
    id_incidencia   BIGINT NOT NULL,                   -- era "incidencia_id"
    url_foto        VARCHAR(500) NOT NULL,             -- era "url_cloudinary"
    public_id       VARCHAR(200),
    FOREIGN KEY (id_incidencia) REFERENCES incidencia(id_incidencia)
);