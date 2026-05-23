package com.DisenoProductos.EcoSolido.Middleware;

import com.DisenoProductos.EcoSolido.Services.HuggingFaceException;
import org.springframework.http.ResponseEntity;
import org.springframework.validation.FieldError;
import org.springframework.web.bind.MethodArgumentNotValidException;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.RestControllerAdvice;
import java.util.Map;

@RestControllerAdvice
public class GlobalExceptionHandler {
    @ExceptionHandler(MethodArgumentNotValidException.class)
    public ResponseEntity<?> handleValidationsErrors(MethodArgumentNotValidException ex){
        String mensaje = ex.getBindingResult()
                .getFieldErrors()
                .stream()
                .map(FieldError::getDefaultMessage)
                .findFirst()
                .orElse("Error de validación");
        return ResponseEntity.badRequest().body(mensaje);
    }
    @ExceptionHandler(HuggingFaceException.class)
    public ResponseEntity<?> handleIAError(HuggingFaceException ex) {
            return ResponseEntity.ok()
                    .body(Map.of("descripcion", "Lo siento, no pude ver muy bien las fotos " +
                            "por lo cual no puedo describirlas. ¿Podrías volver a pasarlas o cambiar de fotos?"));
    }
    @ExceptionHandler(Exception.class)
    public ResponseEntity<?> handleGenericError(Exception ex) {
        return ResponseEntity.internalServerError()
                .body("Ocurrió un error inesperado.");
    }
}
