package com.DisenoProductos.EcoSolido.Services;

import jakarta.persistence.EntityManager;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Component;
    @Component
    public class BackupScheduler {
        @Autowired
        private EntityManager entityManager;
        @Scheduled(cron = "0 0 0 * * *") // Cada día a medianoche
        public void ejecutarBackup() {
            entityManager.createNativeQuery("CALL generarBackup()").executeUpdate();
        }
    }
