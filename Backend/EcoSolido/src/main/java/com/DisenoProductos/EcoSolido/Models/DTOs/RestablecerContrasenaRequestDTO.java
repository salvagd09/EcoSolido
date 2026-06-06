package com.DisenoProductos.EcoSolido.Models.DTOs;

public class RestablecerContrasenaRequestDTO {
    private String correo;              // ← para encontrar al usuario
    private String telefono;            // ← uno u otro
    private String nuevaContrasena;
    private String nuevaContrasenaRepetida;
    public String getNuevaContrasena() {
        return nuevaContrasena;
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
    public void setNuevaContrasena(String nuevaContrasena) {
        this.nuevaContrasena = nuevaContrasena;
    }
    public String getNuevaContrasenaRepetida() {
        return nuevaContrasenaRepetida;
    }
    public void setNuevaContrasenaRepetida(String nuevaContrasenaRepetida) {
        this.nuevaContrasenaRepetida = nuevaContrasenaRepetida;
    }
}
