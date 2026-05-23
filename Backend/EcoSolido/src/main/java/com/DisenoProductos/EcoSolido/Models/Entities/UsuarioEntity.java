package com.DisenoProductos.EcoSolido.Models.Entities;

import jakarta.persistence.*;

@Entity
@Table(name="usuario")
public class UsuarioEntity {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name="id_ciudadano")
    private Integer idCiudadano;
    @Column(name="nombre_completo")
    private String nombreCompleto;
    @Column(name="apellido_completo")
    private String apellidoConpleto;
    private String dni;
    private String telefono;
    @Column(name="nombre_usuario")
    private String nombreUsuario;
    private String contrasena;
    @Column(name="pregunta_seguridad")
    private String preguntaSeguridad;
    public Integer getIdCiudadano() {
        return idCiudadano;
    }
    public void setIdCiudadano(Integer idCiudadano) {
        this.idCiudadano = idCiudadano;
    }
    public String getNombreCompleto() {
        return nombreCompleto;
    }
    public void setNombreCompleto(String nombreCompleto) {
        this.nombreCompleto = nombreCompleto;
    }
    public String getApellidoConpleto() {
        return apellidoConpleto;
    }
    public void setApellidoConpleto(String apellidoConpleto) {
        this.apellidoConpleto = apellidoConpleto;
    }
    public String getDni() {
        return dni;
    }
    public void setDni(String dni) {
        this.dni = dni;
    }
    public String getTelefono() {
        return telefono;
    }
    public void setTelefono(String telefono) {
        this.telefono = telefono;
    }
    public String getNombreUsuario() {
        return nombreUsuario;
    }
    public void setNombreUsuario(String nombreUsuario) {
        this.nombreUsuario = nombreUsuario;
    }
    public String getContrasena() {
        return contrasena;
    }
    public void setContrasena(String contrasena) {
        this.contrasena = contrasena;
    }
    public String getPreguntaSeguridad() {
        return preguntaSeguridad;
    }
    public void setPreguntaSeguridad(String preguntaSeguridad) {
        this.preguntaSeguridad = preguntaSeguridad;
    }
}
