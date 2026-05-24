package com.DisenoProductos.EcoSolido.Integrations;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpEntity;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpMethod;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;

import java.util.Base64;
import java.util.List;
import java.util.Map;

@Service
public class GoogleVisionIntegration {

    @Value("${google.vision.api.key}")
    private String apiKey;

    private static final String VISION_API_URL = "https://vision.googleapis.com/v1/images:annotate?key=";

    private final RestTemplate restTemplate = new RestTemplate();

    public String describirFoto(String imageUrl) {
        System.out.println("=== Google Vision: Generando descripción para URL: " + imageUrl);
        System.out.println("=== Google Vision: API Key configurada: " + (apiKey != null ? "SI" : "NO"));
        
        if (apiKey == null || apiKey.isEmpty()) {
            throw new IllegalStateException("API Key de Google Vision no configurada. Agrega google.vision.api.key en application.properties");
        }
        
        try {
            // Crear el cuerpo de la solicitud para Google Vision API
            Map<String, Object> imageRequest = Map.of(
                "source", Map.of("imageUri", imageUrl)
            );
            
            Map<String, Object> featureRequest = Map.of(
                "type", "LABEL_DETECTION",
                "maxResults", 10
            );
            
            Map<String, Object> request = Map.of(
                "image", imageRequest,
                "features", List.of(featureRequest)
            );
            
            Map<String, Object> body = Map.of("requests", List.of(request));

            // Configurar headers
            HttpHeaders headers = new HttpHeaders();
            headers.set("Content-Type", "application/json");
            
            HttpEntity<Map<String, Object>> entity = new HttpEntity<>(body, headers);

            // Hacer la solicitud a Google Vision API
            String url = VISION_API_URL + apiKey;
            System.out.println("=== Google Vision: URL completa: " + url);
            
            ResponseEntity<Map> response = restTemplate.exchange(
                url,
                HttpMethod.POST,
                entity,
                Map.class
            );

            System.out.println("=== Google Vision: Status Code: " + response.getStatusCode());
            System.out.println("=== Google Vision: Respuesta completa: " + response.getBody());

            // Procesar la respuesta
            if (response.getBody() != null && response.getBody().containsKey("responses")) {
                List<Map<String, Object>> responses = (List<Map<String, Object>>) response.getBody().get("responses");
                
                if (!responses.isEmpty()) {
                    Map<String, Object> firstResponse = responses.get(0);
                    
                    // Verificar si hay error en la respuesta
                    if (firstResponse.containsKey("error")) {
                        Map<String, Object> error = (Map<String, Object>) firstResponse.get("error");
                        String errorMessage = (String) error.get("message");
                        Integer errorCode = (Integer) error.get("code");
                        System.out.println("=== Google Vision: Error en respuesta: " + errorMessage + " (code: " + errorCode + ")");
                        throw new IllegalStateException("Error de Google Vision (" + errorCode + "): " + errorMessage);
                    }
                    
                    if (firstResponse.containsKey("labelAnnotations")) {
                        List<Map<String, Object>> labels = (List<Map<String, Object>>) firstResponse.get("labelAnnotations");
                        
                        if (!labels.isEmpty()) {
                            // Construir descripción a partir de las etiquetas
                            StringBuilder descripcion = new StringBuilder("Imagen que muestra: ");
                            for (int i = 0; i < Math.min(5, labels.size()); i++) {
                                String description = (String) labels.get(i).get("description");
                                Double score = (Double) labels.get(i).get("score");
                                System.out.println("=== Google Vision: Label [" + i + "]: " + description + " (score: " + score + ")");
                                if (description != null && score != null && score > 0.5) {
                                    if (i > 0) {
                                        descripcion.append(", ");
                                    }
                                    descripcion.append(description);
                                }
                            }
                            descripcion.append(".");
                            System.out.println("=== Google Vision: Descripción generada: " + descripcion);
                            return descripcion.toString();
                        } else {
                            System.out.println("=== Google Vision: No se encontraron etiquetas en la imagen");
                        }
                    }
                    
                    System.out.println("=== Google Vision: Respuesta sin labelAnnotations ni error");
                    return "No se pudo generar una descripción para esta imagen.";
                } else {
                    System.out.println("=== Google Vision: Respuesta vacía");
                }
            } else {
                System.out.println("=== Google Vision: Respuesta sin 'responses' o null");
            }
            
            return "No se pudo generar una descripción para esta imagen.";
            
        } catch (Exception e) {
            System.out.println("=== Google Vision: Excepción: " + e.getMessage());
            e.printStackTrace();
            throw new IllegalStateException("Error al procesar la imagen con Google Vision: " + e.getMessage(), e);
        }
    }
}