package com.DisenoProductos.EcoSolido.Models.Entities;

import com.DisenoProductos.EcoSolido.Models.States.GiroNegocio;
import com.DisenoProductos.EcoSolido.Models.States.Rol;
import jakarta.persistence.*;
import jakarta.validation.constraints.NotBlank;

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
    @Column(name = "ruc", unique = true, length = 11)
    private String ruc;
    @Enumerated(EnumType.STRING)
    @Column(name = "giro", length = 30)
    private GiroNegocio giro;

    @Column(name = "latitud")
    private Double latitud;

    @Column(name = "longitud")
    private Double longitud;
    @Column(name="razon_social")
    private String razonSocial;
    @Column(name = "direccion_texto")
    private String direccionTexto;
    private String telefono;
    @Column(name="correo_electronico")
    private String correoElectronico;
    @Column(name = "nombre_usuario")
    private String nombreUsuario;
    @Column(name="contrasena")
    private String contrasena;
    @Column(name = "pregunta_seguridad")
    private String preguntaSeguridad;
    @Column(name="respuesta_pregunta")
    private String respuestaPregunta;
    @Column(name="puntos", nullable = false)
    private Integer puntos = 0;
    @Column(name="rol")
    @Enumerated(EnumType.STRING)
    private Rol rol;
    public Integer getIdUsuario() {
        return idUsuario;
    }
    public Rol getRol() {
        return rol;
    }
    public void setRol(Rol rol) {
        this.rol = rol;
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
    public String getRuc() {
        return ruc;
    }
    public void setRuc(String ruc) {
        this.ruc = ruc;
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
    public Integer getPuntos() {return puntos;}
    public void setPuntos(Integer puntos) {this.puntos = puntos;}

    public Double getLatitud() {
        return latitud;
    }

    public void setLatitud(Double latitud) {
        this.latitud = latitud;
    }

    public Double getLongitud() {
        return longitud;
    }

    public void setLongitud(Double longitud) {
        this.longitud = longitud;
    }

    public String getDireccionTexto() {
        return direccionTexto;
    }

    public void setDireccionTexto(String direccionTexto) {
        this.direccionTexto = direccionTexto;
    }

    public String getRazonSocial() {
        return razonSocial;
    }

    public GiroNegocio getGiro() {
        return giro;
    }

    public void setGiro(GiroNegocio giro) {
        this.giro = giro;
    }

    public void setRazonSocial(String razonSocial) {
        this.razonSocial = razonSocial;
    }
}
