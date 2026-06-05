package com.DisenoProductos.EcoSolido.Models.DTOs;

public class LoginRequestDTO {
    private String nombreUsuario;
    private String contrasena;
    private String token;
    public String getNombreUsuario() {return nombreUsuario;}
    public void setNombreUsuario(String nombreUsuario) {this.nombreUsuario = nombreUsuario;}
    public String getContrasena() {return contrasena;}
    public void setContrasena(String contrasena) {this.contrasena = contrasena;}
    public String getToken() {
        return token;
    }
    public void setToken(String token) {this.token = token;}
}
