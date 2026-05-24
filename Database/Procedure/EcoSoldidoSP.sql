USE EcoSolido;
DELIMITER //
CREATE PROCEDURE generarBackup()
BEGIN
    CREATE TABLE IF NOT EXISTS incidencia_backup (
        id_backup       BIGINT AUTO_INCREMENT PRIMARY KEY,
        id_incidencia   BIGINT,
        descripcion     TEXT,
        categoria       VARCHAR(100),
        estado          VARCHAR(50),
        fecha           DATETIME,
        fecha_backup    DATETIME
    );

    INSERT INTO incidencia_backup (id_incidencia, descripcion, categoria, estado, fecha, fecha_backup)
    SELECT id_incidencia, descripcion, categoria, estado, fecha, NOW()
    FROM incidencia
    WHERE id_incidencia NOT IN (SELECT id_incidencia FROM incidencia_backup);
END //
DELIMITER ;
