package com.DisenoProductos.EcoSolido.Models.DTOs;

public class MetricasResponseDTO {
    long total;
    long resueltas;
    long enProceso;
    long pendientes;
    public long getTotal() {
        return total;
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
