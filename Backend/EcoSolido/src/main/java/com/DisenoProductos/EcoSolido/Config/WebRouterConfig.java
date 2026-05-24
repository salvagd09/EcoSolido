package com.DisenoProductos.EcoSolido.Config;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.http.MediaType;
import org.springframework.web.reactive.function.server.RouterFunction;
import org.springframework.web.reactive.function.server.RouterFunctions;
import org.springframework.web.reactive.function.server.ServerResponse;

import java.util.Map;

@Configuration
public class WebRouterConfig {

    @Bean
    public RouterFunction<ServerResponse> healthRouter() {
        return RouterFunctions.route()
                .GET("/api/health", request -> ServerResponse.ok()
                        .contentType(MediaType.APPLICATION_JSON)
                        .bodyValue(Map.of("status", "ok", "servicio", "EcoSolido")))
                .build();
    }
}
