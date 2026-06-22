package com.DisenoProductos.EcoSolido.Models.DTOs;

public class MetricasResponseDTO {
    private long total;
    private long resueltas;
    private long enProceso;
    private long pendientes;
    private long incidenciasEsteMes;
    public long getTotal() {
        return total;
    }
    public long getIncidenciasEsteMes() {
        return incidenciasEsteMes;
    }
    public void setIncidenciasEsteMes(long incidenciasEsteMes) {
        this.incidenciasEsteMes = incidenciasEsteMes;
    }

    public void setTotal(long total) {
        this.total = total;
    }

    public long getResueltas() {
        return resueltas;
    }

    public void setResueltas(long resueltas) {
        this.resueltas = resueltas;
    }

    public long getEnProceso() {
        return enProceso;
    }

    public void setEnProceso(long enProceso) {
        this.enProceso = enProceso;
    }

    public long getPendientes() {
        return pendientes;
    }

    public void setPendientes(long pendientes) {
        this.pendientes = pendientes;
    }
}
