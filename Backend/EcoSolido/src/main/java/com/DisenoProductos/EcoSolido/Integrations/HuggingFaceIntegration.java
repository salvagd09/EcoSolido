package com.DisenoProductos.EcoSolido.Integrations;

import com.DisenoProductos.EcoSolido.Services.HuggingFaceException;
import org.springframework.beans.factory.annotation.Value;

import org.springframework.stereotype.Service;
import org.springframework.web.reactive.function.client.WebClient;

import java.util.ArrayList;
import java.util.List;
import java.util.Map;

@Service
public class HuggingFaceIntegration {

    @Value("${huggingface.api.key}")
    private String apiKey;

    @Value("${huggingface.api.url}")
    private String apiUrl;

    private final WebClient webClient = WebClient.create();

    public String describirFotos(List<String> urlFotos) {
        try {
            List<Map<String, Object>> content = new ArrayList<>();

            content.add(Map.of(
                    "type", "text",
                    "text", "Describe estas imágenes en español en 2 oraciones como si fuera el reporte " +
                            "de una incidencia urbana. Si las imágenes son demasiado borrosas, pixeleadas o no " +
                            "puedes distinguir claramente su contenido, responde EXACTAMENTE con: " +
                            "'Lo siento, no pude ver muy bien las fotos por lo cual no puedo describirlas. " +
                            "¿Podrías volver a pasarlas o cambiar de fotos?'"
            ));

            for (String url : urlFotos) {
                content.add(Map.of(
                        "type", "image_url",
                        "image_url", Map.of("url", url)
                ));
            }

            Map<String, Object> body = Map.of(
                    "model", "google/gemma-4-31B-it",
                    "messages", List.of(
                            Map.of("role", "user", "content", content)
                    )
            );

            Map response = webClient.post()
                    .uri(apiUrl)
                    .header("Authorization", "Bearer " + apiKey)
                    .header("Content-Type", "application/json")
                    .bodyValue(body)
                    .retrieve()
                    .bodyToMono(Map.class)
                    .block();

            List<Map> choices = (List<Map>) response.get("choices");
            Map message = (Map) choices.get(0).get("message");
            return (String) message.get("content");

        } catch (Exception e) {
            throw new HuggingFaceException("No se pudo describir las fotos.", e);
        }
    }
}
