package com.DisenoProductos.EcoSolido.Models.DTOs;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;

@JsonIgnoreProperties(ignoreUnknown = true)
public class ReniecResponseDTO {
    private boolean success;
    private ReniecDataDTO data;

    public boolean isSuccess() {
        return success;
    }

    public void setSuccess(boolean success) {
        this.success = success;
    }

    public ReniecDataDTO getData() {
        return data;
    }

    public void setData(ReniecDataDTO data) {
        this.data = data;
    }
}
