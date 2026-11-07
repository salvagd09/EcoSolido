package com.DisenoProductos.EcoSolido.Models.DTOs;

public record EstablecimientoDTO (
    String codigo,      // "0000" = domicilio fiscal; otros = anexos
    String tipo,      // "DOMICILIO FISCAL", "LOCAL COMERCIAL", "ALMACEN"...
    String direccion,
    String distrito
){}
