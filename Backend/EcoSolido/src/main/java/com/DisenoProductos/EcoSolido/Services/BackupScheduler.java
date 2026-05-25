package com.DisenoProductos.EcoSolido.Services;



import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Component;
import java.time.LocalDate;

@Component
    public class BackupScheduler {
        @Scheduled(cron = "0 0 0 * * *") // Cada día a medianoche
        public void ejecutarBackup() {
            try {
                // Ruta relativa a la raíz del proyecto
                String rutaBackup = "../Database/Backup/backup_" +
                        LocalDate.now() + ".sql";

                ProcessBuilder pb = new ProcessBuilder(
                        "mysqldump",
                        "-u", "root",
                        "-ptu_password",     // Sin espacio entre -p y la contraseña
                        "EcoSolido"
                );

                pb.redirectOutput(new java.io.File(rutaBackup));
                pb.redirectErrorStream(true);
                Process process = pb.start();
                process.waitFor();

            } catch (Exception e) {
                System.err.println("Error al generar backup: " + e.getMessage());
            }
        }
    }
