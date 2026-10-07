package com.DisenoProductos.EcoSolido.Integrations;

import com.DisenoProductos.EcoSolido.Models.DTOs.GenerarRecomendacionesRequest;
import com.DisenoProductos.EcoSolido.Services.HuggingFaceException;
import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.JsonMappingException;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.springframework.beans.factory.annotation.Value;

import org.springframework.cache.annotation.Cacheable;
import org.springframework.stereotype.Service;
import org.springframework.web.reactive.function.client.WebClient;
import org.springframework.web.reactive.function.client.WebClientResponseException;

import java.time.Duration;
import java.util.ArrayList;
import java.util.Base64;
import java.util.List;
import java.util.Map;

@Service
public class HuggingFaceIntegration {

    @Value("${huggingface.api.key}")
    private String apiKey;

    @Value("${huggingface.api.url}")
    private String apiUrl;

    private final WebClient webClient = WebClient.create();
    @Cacheable(value="descripciones",key = "#urlFotos.toString()")
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
                byte[] imageBytes = webClient.get()
                        .uri(url)
                        .retrieve()
                        .bodyToMono(byte[].class)
                        .block();

                String base64 = Base64.getEncoder().encodeToString(imageBytes);
                String dataUri = "data:image/jpeg;base64," + base64;

                content.add(Map.of(
                        "type", "image_url",
                        "image_url", Map.of("url", dataUri)  // ← Data URI en lugar de URL
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
                    .timeout(Duration.ofSeconds(60))    // ← timeout agregado
                    .block();
            List<Map> choices = (List<Map>) response.get("choices");
            Map message = (Map) choices.get(0).get("message");
            return (String) message.get("content");

        }  catch (Exception e) {
            if (e instanceof org.springframework.web.reactive.function.client.WebClientResponseException wce) {
                System.err.println("Error HF: " + wce.getResponseBodyAsString());
            }
            throw new HuggingFaceException("No se pudo describir las fotos.", e);
        }
    }
    @Cacheable(value="titulos",key="#descripcion")
    public String generarTitulo(String descripcion) {
        try {
            Map<String, Object> body = Map.of(
                    "model", "meta-llama/Llama-3.1-8B-Instruct",
                    "max_tokens",30,
                    "messages", List.of(
                            Map.of(
                                    "role", "user",
                                    "content", "Genera un título corto y descriptivo (máximo 6 palabras) " +
                                            "en español para una incidencia urbana con esta descripción: \"" +
                                            descripcion + "\". Responde SOLO con el título, sin comillas ni explicaciones."
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

        }  catch (Exception e) {
            throw new HuggingFaceException("No se pudo generar el título.", e);
        }
    }
    public List<String> generarRecomendaciones(GenerarRecomendacionesRequest request){
        String contextoExtra = (request.getContexto() != null && !request.getContexto().isBlank())
                ? " Contexto adicional: " + request.getContexto() + "."
                : "";
        try{
            Map<String, Object> body = Map.of(
                    "model", "google/gemma-4-31B-it",
                    "max_tokens", 300,
                    "messages", List.of(
                            Map.of(
                                    "role", "user",
                                    "content", "Genera exactamente 2 recomendaciones prácticas y diferentes " +
                                            "para un ciudadano de Lima sobre cómo manejar correctamente residuos de tipo: '" +
                                            request.getTipoMaterial() + "'." + contextoExtra +
                                            " Responde SOLO con un JSON con este formato exacto, sin texto adicional: " +
                                            "{\"recomendaciones\": [\"recomendacion1\", \"recomendacion2\"]}"
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
            String contenido = (String) message.get("content");
            // Limpiar backticks y markdown que el modelo agrega
            String jsonLimpio = contenido
                    .replaceAll("```json", "")
                    .replaceAll("```", "")
                    .trim();
            // Extraer solo el JSON por si hay texto adicional
            int inicio = jsonLimpio.indexOf('{');
            int fin = jsonLimpio.lastIndexOf('}') + 1;
            if (inicio >= 0 && fin > inicio) {
                jsonLimpio = jsonLimpio.substring(inicio, fin);
            }
            ObjectMapper mapper = new ObjectMapper();
            Map<String, List<String>> resultado = mapper.readValue(jsonLimpio, Map.class);
            return resultado.get("recomendaciones");
        } catch (Exception e) {
            throw new HuggingFaceException("No se pudieron generar las recomendaciones.", e);
        }
    }
}
