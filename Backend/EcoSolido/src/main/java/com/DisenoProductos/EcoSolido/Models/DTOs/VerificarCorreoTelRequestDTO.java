package com.DisenoProductos.EcoSolido.Models.DTOs;

public class VerificarCorreoTelRequestDTO {
    private String telefono;
    private String correo;
    public String getTelefono() {
        return telefono;
    }
    public void setTelefono(String telefono) {
        this.telefono = telefono;
    }
    public String getCorreo() {
        return correo;
    }
    public void setCorreo(String correo) {
        this.correo = correo;
    }
}
