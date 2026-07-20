package com.DisenoProductos.EcoSolido.Models.DTOs;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import com.fasterxml.jackson.databind.annotation.JsonDeserialize;

import java.util.List;

@JsonIgnoreProperties(ignoreUnknown = true)
public class ReniecResponseDTO {
    private boolean success;
    @JsonDeserialize(using = FlexibleReniecDataDeserializer.class)
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
