package com.DisenoProductos.EcoSolido.Models.DTOs;

import com.DisenoProductos.EcoSolido.Models.Entities.UsuarioEntity;

public class CrearUsuarioResponseDTO {
    private String nombreUsuario;
    private String nombreCompleto;
    private String apellidoCompleto;
    private String ruc;
    private String razonSocial;
    public static CrearUsuarioResponseDTO desde(UsuarioEntity u) {
        CrearUsuarioResponseDTO dto = new CrearUsuarioResponseDTO();
        dto.nombreUsuario = u.getNombreUsuario();
        dto.nombreCompleto = u.getNombreCompleto();
        dto.apellidoCompleto = u.getApellidoCompleto();
        dto.ruc = u.getRuc();
        dto.razonSocial = u.getRazonSocial();
        return dto;
    }

    public String getNombreUsuario() { return nombreUsuario; }
    public String getNombreCompleto() { return nombreCompleto; }
    public String getApellidoCompleto() { return apellidoCompleto; }
    public String getRuc() { return ruc; }
    public String getRazonSocial() { return razonSocial; }
}
