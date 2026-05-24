package com.DisenoProductos.EcoSolido.Controllers;

import com.DisenoProductos.EcoSolido.Models.DTOs.DescribirFotosRequestDTO;
import com.DisenoProductos.EcoSolido.Models.DTOs.DescribirFotosResponseDTO;
import com.DisenoProductos.EcoSolido.Services.IncidenciaService;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.server.ResponseStatusException;
import reactor.core.publisher.Mono;
import reactor.core.scheduler.Schedulers;

import java.util.Map;

@RestController
@RequestMapping("/api/incidencias")
public class IncidenciaController {

    private final IncidenciaService incidenciaService;

    public IncidenciaController(IncidenciaService incidenciaService) {
        this.incidenciaService = incidenciaService;
    }

    @GetMapping("/health")
    public Mono<Map<String, String>> health() {
        return Mono.just(Map.of("status", "ok", "servicio", "EcoSolido"));
    }

    @PostMapping("/describir-fotos")
    public Mono<DescribirFotosResponseDTO> describirFotos(@RequestBody DescribirFotosRequestDTO request) {
        return Mono.fromCallable(() -> {
                    String descripcion = incidenciaService.generarDescripcionDesdeFotos(request.getImagenes());
                    return new DescribirFotosResponseDTO(descripcion);
                })
                .subscribeOn(Schedulers.boundedElastic())
                .onErrorMap(IllegalArgumentException.class, e ->
                        new ResponseStatusException(HttpStatus.BAD_REQUEST, e.getMessage(), e))
                .onErrorMap(IllegalStateException.class, e ->
                        new ResponseStatusException(HttpStatus.SERVICE_UNAVAILABLE, e.getMessage(), e))
                .onErrorMap(Exception.class, e ->
                        new ResponseStatusException(
                                HttpStatus.INTERNAL_SERVER_ERROR,
                                "Error inesperado al generar la descripción: " + e.getMessage(),
                                e));
    }

}

