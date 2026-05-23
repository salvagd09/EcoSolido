package com.DisenoProductos.EcoSolido.Models.DTOs;

import jakarta.validation.constraints.NotBlank;

public class IncidenciaRequestDTO {
    @NotBlank(message = "No se ha podido registrar su incidencia. Debe colocar su descripción.")
    private String descripcion;
    @NotBlank(message = "No se ha podido registrar su incidencia. Debe establecer la categoría de la incidencia.")
    private String categoria;

    public String getDescripcion() {
        return descripcion;
    }

    public void setDescripcion(String descripcion) {
        this.descripcion = descripcion;
    }

    public String getCategoria() {
        return categoria;
    }

    public void setCategoria(String categoria) {
        this.categoria = categoria;
    }
}
