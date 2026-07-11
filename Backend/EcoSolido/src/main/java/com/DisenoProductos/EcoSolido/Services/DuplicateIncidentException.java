package com.DisenoProductos.EcoSolido.Services;

public class DuplicateIncidentException extends RuntimeException {
    public DuplicateIncidentException(String message) {
        super(message);
    }
}