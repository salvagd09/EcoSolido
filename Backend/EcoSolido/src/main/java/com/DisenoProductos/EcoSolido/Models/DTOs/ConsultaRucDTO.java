package com.DisenoProductos.EcoSolido.Models.DTOs;
import java.util.List;
public record ConsultaRucDTO(
        boolean encontrado,
        String ruc,
        String razonSocial,
        String estado,       // ACTIVO, BAJA DE OFICIO, SUSPENSION TEMPORAL...
        String condicion,    // HABIDO, NO HABIDO
        List<EstablecimientoDTO> establecimientos,
        String mensaje
) {
    public static ConsultaRucDTO noEncontrado(String ruc, String mensaje) {
        return new ConsultaRucDTO(false, ruc, null, null, null, List.of(), mensaje);
    }

    public boolean estaActivoYHabido() {
        return encontrado && "ACTIVO".equals(estado) && "HABIDO".equals(condicion);
    }

    public boolean tieneLocalEnDistrito(String distrito) {
        return establecimientos.stream()
                .anyMatch(e -> e.distrito().equalsIgnoreCase(distrito));
    }
}