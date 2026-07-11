package com.DisenoProductos.EcoSolido.Models.Entities;

import jakarta.persistence.*;

@Entity
@Table(name = "insignia")
public class InsigniaEntity {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id_insignia")
    private Integer idInsignia;

    @Column(nullable = false, unique = true)
    private String nombre;

    @Column(nullable = false, length = 1000)
    private String descripcion;

    @Column(nullable = false)
    private String icono;

    @Column(name = "requisito_incidencias", nullable = false)
    private Integer requisitoIncidencias;

    @Column(name = "recompensa", length = 500)
    private String recompensa;

    public Integer getIdInsignia() { return idInsignia; }
    public void setIdInsignia(Integer idInsignia) { this.idInsignia = idInsignia; }

    public String getNombre() { return nombre; }
    public void setNombre(String nombre) { this.nombre = nombre; }

    public String getDescripcion() { return descripcion; }
    public void setDescripcion(String descripcion) { this.descripcion = descripcion; }

    public String getIcono() { return icono; }
    public void setIcono(String icono) { this.icono = icono; }

    public Integer getRequisitoIncidencias() { return requisitoIncidencias; }
    public void setRequisitoIncidencias(Integer requisitoIncidencias) { this.requisitoIncidencias = requisitoIncidencias; }

    public String getRecompensa() { return recompensa; }
    public void setRecompensa(String recompensa) { this.recompensa = recompensa; }
}
