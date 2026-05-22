package com.DisenoProductos.EcoSolido.Controllers;

import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RestController;
import reactor.core.publisher.Mono;

import java.util.Map;

@RestController
public class HealthController {

    @GetMapping("/api/health")
    public Mono<Map<String, String>> health() {
        return Mono.just(Map.of("status", "ok"));
    }
}
