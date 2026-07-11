package com.DisenoProductos.EcoSolido.Services;

import com.DisenoProductos.EcoSolido.Integrations.HuggingFaceIntegration;
import com.DisenoProductos.EcoSolido.Models.DTOs.GenerarRecomendacionesRequest;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
@Service
public class RecomendacionService {
    @Autowired
    private final HuggingFaceIntegration huggingFaceIntegration;
    public RecomendacionService(HuggingFaceIntegration huggingFaceIntegration) {
        this.huggingFaceIntegration = huggingFaceIntegration;
    }
    public List<String> generarRecomendaciones(GenerarRecomendacionesRequest request){
        return huggingFaceIntegration.generarRecomendaciones(request);
    }
}
