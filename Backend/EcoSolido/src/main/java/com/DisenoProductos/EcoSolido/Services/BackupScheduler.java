package com.DisenoProductos.EcoSolido.Services;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Component;
import java.io.File;
import java.time.LocalDate;
import java.time.LocalDateTime;

@Component
public class BackupScheduler {
    @Value("${spring.datasource.password}")
    private String dbPassword;
    @Value("${spring.datasource.username}")
    private String dbUsername;
    @Value("${mysqldump.path:mysqldump}")
    private String mysqldumpPath;
    @Scheduled(cron = "0 0 0 * * *")
    public void ejecutarBackup() {
        System.out.println("✅ Scheduler disparado: " + LocalDateTime.now());
        try {
            File dirBackup = new File("../../Database/Backup/");
            if (!dirBackup.exists()) dirBackup.mkdirs();
            System.out.println("Ruta absoluta: " + dirBackup.getAbsolutePath());

            String rutaBackup = "../../Database/Backup/backup_" + LocalDate.now() + ".sql";

            ProcessBuilder pb = new ProcessBuilder(
                    mysqldumpPath,
                    "-u", dbUsername,
                    "-p" + dbPassword,
                    "EcoSolido"
            );

            pb.redirectOutput(new File(rutaBackup));
            pb.redirectErrorStream(true);
            Process process = pb.start();
            int exitCode = process.waitFor();

            if (exitCode == 0) {
                System.out.println("✅ Backup generado: " + rutaBackup);
            } else {
                System.err.println("❌ mysqldump falló con código: " + exitCode);
            }

        } catch (Exception e) {
            System.err.println("Error al generar backup: " + e.getMessage());
        }
    }
}
