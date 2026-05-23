package com.DisenoProductos.EcoSolido.Models.Entities;

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
    private String descripcion;
    private LocalDateTime fecha;
    @ManyToOne
    @JoinColumn(name="id_ciudadano")
    private UsuarioEntity usuario;
    @OneToMany(mappedBy="incidencia",cascade=CascadeType.ALL)
    @Size(min=1,message="Debe adjuntar al menos 1 foto")
    private List<IncidenciaFotoEntity> fotos;
    public Integer getIdIncidencia() {
        return idIncidencia;
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
}
