package com.DisenoProductos.EcoSolido.Models.DTOs;

public class LoginResponseDTO {
    private String token;
    private String nombreUsuario;
    private Integer puntos;
    public LoginResponseDTO(String token, String nombreUsuario, Integer puntos) {
        this.token = token;
        this.nombreUsuario = nombreUsuario;
        this.puntos = puntos;
    }
    public String getNombreUsuario() {return nombreUsuario;}
    public void setNombreUsuario(String nombreUsuario) {this.nombreUsuario = nombreUsuario;}
    public String getToken() {
        return token;
    }
    public void setToken(String token) {
        this.token = token;
    }
    public Integer getPuntos() {return puntos;}
    public void setPuntos(Integer puntos) {this.puntos = puntos;}

}
