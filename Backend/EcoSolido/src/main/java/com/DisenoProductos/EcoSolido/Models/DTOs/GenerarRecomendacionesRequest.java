package com.DisenoProductos.EcoSolido.Models.DTOs;

public class GenerarRecomendacionesRequest {
    private String tipoMaterial;
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
