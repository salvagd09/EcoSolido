package com.DisenoProductos.EcoSolido.Models.DTOs;

import jakarta.validation.constraints.Size;

public class GenerarRecomendacionesRequest {
    private String tipoMaterial;
    @Size(max = 200, message = "El contexto no puede superar los 200 caracteres")
    private String contexto;
    public String getTipoMaterial() {
        return tipoMaterial;
    }
    public void setTipoMaterial(String tipoMaterial) {
        this.tipoMaterial = tipoMaterial;
    }
    public String getContexto() {
        return contexto;
    }
    public void setContexto(String contexto) {
        this.contexto = contexto;
    }
}
