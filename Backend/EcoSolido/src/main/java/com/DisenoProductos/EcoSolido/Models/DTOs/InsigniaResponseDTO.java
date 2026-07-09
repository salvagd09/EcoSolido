package com.DisenoProductos.EcoSolido.Models.DTOs;

import java.time.LocalDateTime;

public class InsigniaResponseDTO {
    private Integer idInsignia;
    private String nombre;
    private String descripcion;
    private String icono;
    private Integer requisitoIncidencias;
    private String recompensa;
    private boolean desbloqueada;
    private LocalDateTime fechaDesbloqueo;

    public InsigniaResponseDTO() {}

    public InsigniaResponseDTO(Integer idInsignia, String nombre, String descripcion, String icono,
                               Integer requisitoIncidencias, String recompensa, boolean desbloqueada,
                               LocalDateTime fechaDesbloqueo) {
        this.idInsignia = idInsignia;
        this.nombre = nombre;
        this.descripcion = descripcion;
        this.icono = icono;
        this.requisitoIncidencias = requisitoIncidencias;
        this.recompensa = recompensa;
        this.desbloqueada = desbloqueada;
        this.fechaDesbloqueo = fechaDesbloqueo;
    }

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

    public boolean isDesbloqueada() { return desbloqueada; }
    public void setDesbloqueada(boolean desbloqueada) { this.desbloqueada = desbloqueada; }

    public LocalDateTime getFechaDesbloqueo() { return fechaDesbloqueo; }
    public void setFechaDesbloqueo(LocalDateTime fechaDesbloqueo) { this.fechaDesbloqueo = fechaDesbloqueo; }
}
