package com.DisenoProductos.EcoSolido.Integrations;

import com.DisenoProductos.EcoSolido.Services.HuggingFaceException;
import org.springframework.beans.factory.annotation.Value;

import org.springframework.stereotype.Service;
import org.springframework.web.reactive.function.client.WebClient;

import java.util.List;
import java.util.Map;

@Service
public class HuggingFaceIntegration {

    @Value("${huggingface.api.key}")
    private String apiKey;

    @Value("${huggingface.api.url}")
    private String apiUrl;

    private final WebClient webClient = WebClient.create();

    public String describirFoto(String urlFoto) {
        try{
            Map<String, Object> body = Map.of(
                    "model", "google/gema-4-31B-it",
                    "messages", List.of(
                            Map.of(
                                    "role", "user",
                                    "content", List.of(
                                            Map.of(
                                                    "type", "text",
                                                    "text", "Describe esta imagen en español en 2 oraciones como si fuera el reporte de una incidencia urbana."
                                            ),
                                            Map.of(
                                                    "type", "image_url",
                                                    "image_url", Map.of("url", urlFoto)
                                            )
                                    )
                            )
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
        }catch(Exception e){
            throw new HuggingFaceException("No se ha podido establecer la foto.",e);
        }}
}