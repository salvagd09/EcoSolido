package com.DisenoProductos.EcoSolido.Models.Entities;

import jakarta.persistence.*;

@Entity
@Table(name="usuario")
public class UsuarioEntity {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id_usuario")
    private Integer idUsuario;
    @Column(name = "nombre_completo")
    private String nombreCompleto;
    @Column(name = "apellido_completo")
    private String apellidoCompleto;
    private String dni;
    private String telefono;
    @Column(name="correo_electronico")
    private String correoElectronico;
    @Column(name = "nombre_usuario")
    private String nombreUsuario;
    private String contrasena;
    @Column(name = "pregunta_seguridad")
    private String preguntaSeguridad;
    @Column(name="respuesta_pregunta")
    private String respuestaPregunta;
    public Integer getIdUsuario() {
        return idUsuario;
    }
    public void setIdUsuario(Integer idUsuario) {
        this.idUsuario = idUsuario;
    }
    public String getNombreCompleto() {
        return nombreCompleto;
    }
    public void setNombreCompleto(String nombreCompleto) {
        this.nombreCompleto = nombreCompleto;
    }
    public String getApellidoCompleto() {
        return apellidoCompleto;
    }
    public void setApellidoCompleto(String apellidoCompleto) {
        this.apellidoCompleto = apellidoCompleto;
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
    public String getRespuestaPregunta() {return respuestaPregunta;}
    public void setRespuestaPregunta(String respuestaPregunta) {this.respuestaPregunta = respuestaPregunta;}
    public String getCorreoElectronico() {return correoElectronico;}
    public void setCorreoElectronico(String correoElectronico) {this.correoElectronico = correoElectronico;}
}
