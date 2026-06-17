package com.DisenoProductos.EcoSolido.Integrations;

import com.DisenoProductos.EcoSolido.Models.DTOs.ReniecResponseDTO;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;


import java.net.http.HttpClient;
import java.net.http.HttpRequest;
import java.net.http.HttpResponse;
import java.net.URI;
import java.text.Normalizer;
import java.util.Map;

@Service
public class RENIECIntegration {
    @Value("${reniec.api.url}")
    private String apiUrl;

    @Value("${reniec.api.token}")
    private String apiToken;

    private final HttpClient httpClient = HttpClient.newHttpClient();
    private final ObjectMapper mapper = new ObjectMapper();

    public boolean validarDni(String dni, String nombres, String apellidos) throws Exception {
        // Body que pide la API
        String body = mapper.writeValueAsString(Map.of(
                "token", apiToken,
                "type_document", "dni",
                "document_number", dni
        ));

        HttpRequest request = HttpRequest.newBuilder()
                .uri(URI.create(apiUrl))
                .header("Content-Type", "application/json")
                .POST(HttpRequest.BodyPublishers.ofString(body))  // ← POST con body
                .build();

        HttpResponse<String> response = httpClient
                .send(request, HttpResponse.BodyHandlers.ofString());

        ReniecResponseDTO datos = mapper.readValue(response.body(), ReniecResponseDTO.class);
        if (!datos.isSuccess()) {
            throw new RuntimeException("DNI no encontrado en RENIEC");
        }
        String reniecNormalizado = datos.getData().getFull_name()
                .replace(",", "")        // ← quita la coma
                .replaceAll("\\s+", " ") // ← normaliza espacios dobles
                .trim();
        String usuarioNormalizado = (apellidos + " " + nombres)
                .toUpperCase().trim();
        reniecNormalizado = quitarTildes(reniecNormalizado);
        usuarioNormalizado = quitarTildes(usuarioNormalizado);
        return reniecNormalizado.equalsIgnoreCase(usuarioNormalizado);
    }
    private String quitarTildes(String texto) {
        return Normalizer.normalize(texto, Normalizer.Form.NFD)
                .replaceAll("[\\p{InCombiningDiacriticalMarks}]", "");
    }
}
