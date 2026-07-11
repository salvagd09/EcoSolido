package com.DisenoProductos.EcoSolido.Models.DTOs;

public class MetricasResponseDTO {
    private long total;
    private long enProceso;
    private long pendientes;
    private long resueltos;
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

    public long getResueltos() {
        return resueltos;
    }

    public void setResueltos(long resueltos) {
        this.resueltos = resueltos;
    }
}
