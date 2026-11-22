package com.DisenoProductos.EcoSolido.Models.DTOs;

import com.DisenoProductos.EcoSolido.Models.States.GiroNegocio;
import com.DisenoProductos.EcoSolido.Models.States.Rol;

public class LoginResponseDTO {
    private String token;
    private String nombreUsuario;
    private Rol rol;
    private Integer puntos;
    private GiroNegocio giro;
    public LoginResponseDTO(String token, String nombreUsuario,Rol rol, Integer puntos,GiroNegocio giro) {
        this.token = token;
        this.nombreUsuario = nombreUsuario;
        this.puntos = puntos;
        this.rol=rol;
        this.giro=giro;
    }
    public Rol getRol() {
        return rol;
    }
    public void setRol(Rol rol) {
        this.rol = rol;
    }
    public String getNombreUsuario() {return nombreUsuario;}
    public GiroNegocio getGiro() {return giro;}
    public void setGiro(GiroNegocio giro) {this.giro = giro;}
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
