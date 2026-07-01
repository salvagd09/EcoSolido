package com.DisenoProductos.EcoSolido.Models.Entities;

import com.DisenoProductos.EcoSolido.Models.States.IncidenciaEstados;
import jakarta.persistence.*;
import jakarta.validation.constraints.Size;

import java.time.LocalDateTime;
import java.util.List;

@Entity
@Table(name="incidencia")
public class IncidenciaEntity {
    @Id
    @GeneratedValue(strategy=GenerationType.IDENTITY)
    @Column(name="id_incidencia")
    private Integer idIncidencia;
    private String categoria;
    @Column(columnDefinition = "TEXT")
    private String descripcion;
    @Column(name = "titulo")
    private String titulo;
    @Column(name="fecha")
    private LocalDateTime fecha=LocalDateTime.now();
    /*Mejora para tener código eficiente:
    Carga diferida para no traer los datos del usuario si no se necesitan */
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name="id_ciudadano")
    private UsuarioEntity usuario;
    @Enumerated(EnumType.STRING)
    private IncidenciaEstados estado;
    /*Mejora para tener código eficiente
    Carga diferida para evitar traer las fotos innecesariamente en las consultas */
    @OneToMany(mappedBy="incidencia", cascade=CascadeType.ALL, fetch = FetchType.LAZY)
    private List<IncidenciaFotoEntity> fotos;
    @Column(name="latitud")
    private Double latitud;
    @Column(name="longitud")
    private Double longitud;
    @Column(name="direccion_texto")
    private String direccionTexto;
    public Integer getIdIncidencia() {
        return idIncidencia;
    }
    public IncidenciaEstados getEstado() {
        return estado;
    }
    public void setEstado(IncidenciaEstados estado) {
        this.estado = estado;
    }
    public void setIdIncidencia(Integer idIncidencia) {
        this.idIncidencia = idIncidencia;
    }
    public String getCategoria() {
        return categoria;
    }
    public void setCategoria(String categoria) {
        this.categoria = categoria;
    }
    public String getDescripcion() {
        return descripcion;
    }
    public String getTitulo() {
        return titulo;
    }
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
    public void setTitulo(String titulo) {
        this.titulo = titulo;
    }
    public void setDescripcion(String descripcion) {
        this.descripcion = descripcion;
    }
    public List<IncidenciaFotoEntity> getFotos() {
        return fotos;
    }
    public void setFotos(List<IncidenciaFotoEntity> fotos) {
        this.fotos = fotos;
    }
    public LocalDateTime getFecha() {
        return fecha;
    }
    public void setFecha(LocalDateTime fecha) {
        this.fecha = fecha;
    }
    public UsuarioEntity getUsuario() {
        return usuario;
    }
    public void setUsuario(UsuarioEntity usuario) {
        this.usuario = usuario;
    }
    public String getDireccionTexto() {
        return  direccionTexto;
    }
    public void setDireccionTexto(String direccionTexto) {
        this.direccionTexto = direccionTexto;
    }
}
