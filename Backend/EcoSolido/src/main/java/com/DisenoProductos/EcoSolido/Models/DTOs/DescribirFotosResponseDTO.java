package com.DisenoProductos.EcoSolido.Models.DTOs;

public class DescribirFotosResponseDTO {
    private String descripcion;

    public DescribirFotosResponseDTO() {}

    public DescribirFotosResponseDTO(String descripcion) {
        this.descripcion = descripcion;
    }

    public String getDescripcion() {
        return descripcion;
    }

    public void setDescripcion(String descripcion) {
        this.descripcion = descripcion;
    }
}
