package com.DisenoProductos.EcoSolido.Services;

<<<<<<< HEAD
import com.DisenoProductos.EcoSolido.Integrations.HuggingFaceIntegration;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class IncidenciaService {

    public static final String MENSAJE_FOTOS_NO_VISIBLES =
            "Lo siento, no pude ver muy bien las fotos por lo cual no puedo describirlas. "
                    + "¿Podrías volver a pasarlas o cambiar de fotos?";

    private final HuggingFaceIntegration huggingFaceIntegration;

    public IncidenciaService(HuggingFaceIntegration huggingFaceIntegration) {
        this.huggingFaceIntegration = huggingFaceIntegration;
    }

    public String generarDescripcionDesdeFotos(List<String> imagenesBase64) {
        if (imagenesBase64 == null || imagenesBase64.isEmpty()) {
            throw new IllegalArgumentException("Debe enviar al menos una imagen.");
        }

        for (String img : imagenesBase64) {
            if (img == null || !img.startsWith("data:image/")) {
                throw new IllegalArgumentException("Formato de imagen inválido.");
            }
        }

        String resultado = huggingFaceIntegration.describirFotos(imagenesBase64).trim();

        if (esFotosNoVisibles(resultado)) {
            return MENSAJE_FOTOS_NO_VISIBLES;
        }

        return resultado;
    }

    private boolean esFotosNoVisibles(String texto) {
        String normalizado = texto.trim().toLowerCase();
        String esperado = MENSAJE_FOTOS_NO_VISIBLES.toLowerCase();
        return normalizado.equals(esperado) || normalizado.startsWith("lo siento, no pude ver muy bien");
    }
=======
public class IncidenciaService {
>>>>>>> 8cb61bc0232d14d29006225ed16cb6e026b18069
}
