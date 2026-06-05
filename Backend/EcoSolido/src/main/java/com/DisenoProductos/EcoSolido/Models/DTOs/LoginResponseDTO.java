package com.DisenoProductos.EcoSolido.Models.DTOs;

public class LoginResponseDTO {
    private String token;
    private String nombreUsuario;
    public LoginResponseDTO(String token, String nombreUsuario) {
        this.token = token;
        this.nombreUsuario = nombreUsuario;
    }
    public String getNombreUsuario() {return nombreUsuario;}
    public void setNombreUsuario(String nombreUsuario) {this.nombreUsuario = nombreUsuario;}
    public String getToken() {
        return token;
    }
    public void setToken(String token) {
        this.token = token;
    }

}
