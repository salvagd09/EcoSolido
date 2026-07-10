package com.DisenoProductos.EcoSolido.Models.DTOs;

import java.util.List;

public class GenerarRecomendacionesResponse {
    private List<String> recomendaciones;

    public List<String> getRecomendaciones() {
        return recomendaciones;
    }

    public void setRecomendaciones(List<String> recomendaciones) {
        this.recomendaciones = recomendaciones;
    }
}
