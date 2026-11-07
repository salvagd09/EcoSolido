package com.DisenoProductos.EcoSolido.Models.States;

public enum TipoResiduo {
    PAPEL("Papel"),
    CARTON("Cartón"),
    PET("Botellas PET"),
    PLASTICO_DURO("Plástico duro"),
    VIDRIO("Vidrio"),
    METAL_ENVASES("Latas y envases metálicos"),
    TETRAPAK("Tetra Pak");

    private final String etiqueta;
    TipoResiduo(String etiqueta) { this.etiqueta = etiqueta; }
    public String getEtiqueta() { return etiqueta; }
}
