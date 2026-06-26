package com.DisenoProductos.EcoSolido.Models.DTOs;

import java.util.List;

public class SeguirIncidenciaResponseDTO {
    private Integer idIncidencia;
    private String descripcion;
    private String estado;
    private String titulo;
    private String fecha;
    private String direccionTexto;
    public String getDireccionTexto() {
        return direccionTexto;
    }
    public void setDireccionTexto(String direccionTexto) {
        this.direccionTexto = direccionTexto;
    }
    private List<String> urlsImagenes;
    public String getTitulo() {
        return titulo;
    }
    public void setTitulo(String titulo) {
        this.titulo = titulo;
    }
    public List<String> getUrlsImagenes() {
        return urlsImagenes;
    }
    public void setUrlsImagenes(List<String> urlsImagenes) {
        this.urlsImagenes = urlsImagenes;
    }
    public Integer getIdIncidencia() {
        return idIncidencia;
    }
    public void setIdIncidencia(Integer idIncidencia) {
        this.idIncidencia = idIncidencia;
    }
    public String getDescripcion() {
        return descripcion;
    }
    public void setDescripcion(String descripcion) {
        this.descripcion = descripcion;
    }
    public String getEstado() {
        return estado;
    }
    public void setEstado(String estado) {
        this.estado = estado;
    }
    public String getFecha() {
        return fecha;
    }
    public void setFecha(String fecha) {
        this.fecha = fecha;
    }
}
