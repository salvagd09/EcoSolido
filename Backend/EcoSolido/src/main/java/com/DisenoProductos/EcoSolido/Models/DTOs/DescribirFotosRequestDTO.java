package com.DisenoProductos.EcoSolido.Models.DTOs;

import java.util.List;

public class DescribirFotosRequestDTO {
    private List<String> imagenes;

    public List<String> getImagenes() {
        return imagenes;
    }

    public void setImagenes(List<String> imagenes) {
        this.imagenes = imagenes;
    }
}
