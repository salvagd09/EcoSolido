package com.DisenoProductos.EcoSolido.Controllers;

import com.DisenoProductos.EcoSolido.Models.DTOs.GenerarRecomendacionesRequest;
import com.DisenoProductos.EcoSolido.Models.DTOs.GenerarRecomendacionesResponse;
import com.DisenoProductos.EcoSolido.Services.RecomendacionService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;
@RestController
@RequestMapping("/educacion")
public class RecomendacionesController {
    private final RecomendacionService recomendacionService;

    public RecomendacionesController(RecomendacionService recomendacionService) {
        this.recomendacionService = recomendacionService;
    }

    @PostMapping("/recomendaciones")
    public ResponseEntity<?> generarRecomendaciones(@RequestBody GenerarRecomendacionesRequest request) {
        if (request.getTipoMaterial() == null || request.getTipoMaterial().isBlank()) {
            return ResponseEntity.badRequest().body("Debe especificar el tipo de material.");
        }
        List<String> recomendaciones = recomendacionService.generarRecomendaciones(request);
        GenerarRecomendacionesResponse response = new GenerarRecomendacionesResponse();
        response.setRecomendaciones(recomendaciones);
        return ResponseEntity.ok(response);
    }
}
