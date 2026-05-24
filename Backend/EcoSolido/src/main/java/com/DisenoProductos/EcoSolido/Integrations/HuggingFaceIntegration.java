package com.DisenoProductos.EcoSolido.Integrations;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpStatusCode;
import org.springframework.stereotype.Service;
import org.springframework.web.reactive.function.client.WebClient;
import org.springframework.web.reactive.function.client.WebClientResponseException;
import reactor.core.publisher.Mono;

import java.util.ArrayList;
import java.util.List;
import java.util.Map;

@Service
public class HuggingFaceIntegration {

    private static final String MODELO_VISION = "meta-llama/Llama-3.2-11B-Vision-Instruct";

    @Value("${huggingface.api.key}")
    private String apiKey;

    @Value("${huggingface.api.url}")
    private String apiUrl;

    private final WebClient webClient = WebClient.builder().build();

    public String describirFoto(String urlFoto) {
        return describirFotos(List.of(urlFoto));
    }

    public String describirFotos(List<String> urlsFoto) {
        validarConfiguracion();

        List<Map<String, Object>> content = new ArrayList<>();
        content.add(Map.of(
                "type", "text",
                "text",
                "Eres un asistente que redacta reportes de incidencias de residuos sólidos en ciudades. "
                        + "Observa las fotos adjuntas y escribe en español 2 o 3 oraciones describiendo "
                        + "qué problema ambiental o de basura se observa. Sé concreto y profesional."
        ));

        for (String url : urlsFoto) {
            content.add(Map.of(
                    "type", "image_url",
                    "image_url", Map.of("url", url)
            ));
        }

        Map<String, Object> body = Map.of(
                "model", MODELO_VISION,
                "messages", List.of(Map.of("role", "user", "content", content)),
                "max_tokens", 300
        );

        try {
            Map<?, ?> response = webClient.post()
                    .uri(apiUrl)
                    .header("Authorization", "Bearer " + apiKey)
                    .header("Content-Type", "application/json")
                    .bodyValue(body)
                    .retrieve()
                    .onStatus(HttpStatusCode::isError, clientResponse ->
                            clientResponse.bodyToMono(String.class)
                                    .defaultIfEmpty("sin detalle")
                                    .flatMap(errorBody -> Mono.error(new IllegalStateException(
                                            "Error de Hugging Face (" + clientResponse.statusCode() + "): " + errorBody))))
                    .bodyToMono(Map.class)
                    .block();

            if (response == null) {
                throw new IllegalStateException("Respuesta vacía del servicio de IA.");
            }

            @SuppressWarnings("unchecked")
            List<Map<String, Object>> choices = (List<Map<String, Object>>) response.get("choices");
            if (choices == null || choices.isEmpty()) {
                throw new IllegalStateException("La IA no devolvió una descripción.");
            }

            @SuppressWarnings("unchecked")
            Map<String, Object> message = (Map<String, Object>) choices.get(0).get("message");
            Object contentResponse = message.get("content");
            if (contentResponse == null || contentResponse.toString().isBlank()) {
                throw new IllegalStateException("La IA devolvió una descripción vacía.");
            }
            return contentResponse.toString().trim();
        } catch (WebClientResponseException e) {
            throw new IllegalStateException(
                    "Error de Hugging Face (" + e.getStatusCode() + "): " + e.getResponseBodyAsString(), e);
        }
    }

    private void validarConfiguracion() {
        if (apiKey == null || apiKey.isBlank()) {
            throw new IllegalStateException(
                    "HF_TOKEN no está configurado. En PowerShell ejecuta: $env:HF_TOKEN=\"tu_token\" "
                            + "antes de iniciar el backend. Obtén el token en huggingface.co/settings/tokens");
        }
    }
}