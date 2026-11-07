package com.DisenoProductos.EcoSolido.Models.States;

public enum GiroNegocio {
    COMERCIO(false),
    RESTAURANTE(false),
    MERCADO(false),
    HOTEL(false),
    INSTITUCION_EDUCATIVA(false),
    OFICINA(false),
    MANUFACTURA(true),   // fábricas y talleres: muebles, metalmecánica, textil...
    OTRO(false);

    private final boolean requiereDeclaracion;
    GiroNegocio(boolean requiereDeclaracion) { this.requiereDeclaracion = requiereDeclaracion; }
    public boolean requiereDeclaracion() { return requiereDeclaracion; }
}
