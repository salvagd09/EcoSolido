package com.DisenoProductos.EcoSolido.Models.DTOs;

public class RespuestaSeguridadRequestDTO {
    private String correo;      // ← para identificar al usuario
    private String telefono;    // ← uno u otro
    private String respuesta;
    public String getRespuesta() {
        return respuesta;
    }
    public void setRespuesta(String respuesta) {
        this.respuesta = respuesta;
    }
    public String getCorreo() {
        return correo;
    }
    public void setCorreo(String correo) {
        this.correo = correo;
    }
    public String getTelefono() {
        return telefono;
    }
    public void setTelefono(String telefono) {
        this.telefono = telefono;
    }
}
