package com.DisenoProductos.EcoSolido.Models.DTOs;

public class CrearUsuarioResponseDTO {
    private String nombreCompleto;
    private String apellidoCompleto;
    public String getNombreCompleto() {return nombreCompleto;}
    public void setNombreCompleto(String nombreCompleto) {this.nombreCompleto = nombreCompleto;}
    public String getApellidoCompleto() {return apellidoCompleto;}
    public void setApellidoCompleto(String apellidoCompleto) {this.apellidoCompleto = apellidoCompleto;}
}
