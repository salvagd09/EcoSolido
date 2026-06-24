package com.DisenoProductos.EcoSolido.Models.DTOs;

import jakarta.validation.constraints.NotBlank;

public class IncidenciaRequestDTO {
    @NotBlank(message = "No se ha podido registrar su incidencia. Debe colocar su descripción.")
    private String descripcion;
    @NotBlank(message = "No se ha podido registrar su incidencia. Debe establecer la categoría de la incidencia.")
    private String categoria;
    private Double latitud;
    private Double longitud;
    @NotBlank(message="No se ha podido registrar su incidencia. Debe establecer su ubicación")
    private String direccionTexto;
    public Double getLatitud() {
        return latitud;
    }

    public String getDireccionTexto() {
        return direccionTexto;
    }

    public void setDireccionTexto(String direccionTexto) {
        this.direccionTexto = direccionTexto;
    }

    public void setLatitud(Double latitud) {
        this.latitud = latitud;
    }

    public Double getLongitud() {
        return longitud;
    }

    public void setLongitud(Double longitud) {
        this.longitud = longitud;
    }

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
