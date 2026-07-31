package com.DisenoProductos.EcoSolido.Models.DTOs;

import com.DisenoProductos.EcoSolido.Models.States.IncidenciaEstados;

public class CambiarEstadoDTO {
    private IncidenciaEstados estado;

    public IncidenciaEstados getEstado() {
        return estado;
    }

    public void setEstado(IncidenciaEstados estado) {
        this.estado = estado;
    }
}
