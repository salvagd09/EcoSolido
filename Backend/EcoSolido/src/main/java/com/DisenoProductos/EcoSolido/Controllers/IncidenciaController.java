package com.DisenoProductos.EcoSolido.Controllers;

import com.DisenoProductos.EcoSolido.Models.DTOs.SeguirIncidenciaResponseDTO;
import com.DisenoProductos.EcoSolido.Services.IncidenciaService;
import com.DisenoProductos.EcoSolido.Models.DTOs.DescribirFotosRequestDTO;
import com.DisenoProductos.EcoSolido.Models.DTOs.DescribirFotosResponseDTO;
import com.DisenoProductos.EcoSolido.Models.DTOs.IncidenciaRequestDTO;
import jakarta.validation.Valid;
import org.apache.coyote.Response;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/incidencias")
public class IncidenciaController {

    private final  IncidenciaService incidenciaService;
    public IncidenciaController(IncidenciaService incidenciaService) {
        this.incidenciaService = incidenciaService;
    }
    @GetMapping("/seguir")
    public ResponseEntity<?> mostrarIncidencias(Authentication authentication) {
        String userName = authentication.getName(); // Viene del JWT
        return ResponseEntity.ok(incidenciaService.mostrarIncidencias(userName));
    }
    @PostMapping("/registrar")
    public ResponseEntity<?> logroRegistrarIncidencia(
            @RequestPart("incidencia") @Valid IncidenciaRequestDTO incidenciaDTO,
            @RequestPart(value = "fotos", required = false) List<MultipartFile> fotos,
            @RequestParam(value = "urlsFotos", required = false) List<String> urlsFotos,
            Authentication authentication) throws Exception {
        String nombreUsuario = authentication.getName();
        incidenciaService.registrarIncidencia(incidenciaDTO, fotos, urlsFotos, nombreUsuario);
        return ResponseEntity.ok("Su incidencia ha sido registrada exitosamente...");
    }
    @GetMapping("/metricas")
    public ResponseEntity<?> mostrarMetricas(Authentication authentication){
        String userName=authentication.getName();
        return ResponseEntity.ok(incidenciaService.obtenerMetricas(userName));
    }
    @PostMapping("/generar-descripcion")
    public ResponseEntity<?> generarDescripcion(@RequestBody DescribirFotosRequestDTO request){
        if(request.getImagenes() == null || request.getImagenes().isEmpty()){
            return ResponseEntity.badRequest().body("Debe adjuntar al menos 1 foto");
        }
        try {
            String descripcion = incidenciaService.generarDescripcion(request.getImagenes());
            return ResponseEntity.ok(new DescribirFotosResponseDTO(descripcion));
        } catch (Exception e) {
            throw e;
        }
    }
    @PostMapping("/subir-fotos")
    public ResponseEntity<?> subirFotos(@RequestPart("fotos") List<MultipartFile> fotos) {
        if (fotos == null || fotos.isEmpty()) {
            return ResponseEntity.badRequest()
                    .body("Debe adjuntar al menos una foto.");
        }
        try {
            List<String> urls = incidenciaService.subirFotos(fotos);
            return ResponseEntity.ok(Map.of("urls", urls));
        } catch (Exception e) {
            return ResponseEntity.internalServerError()
                    .body("Error al subir las fotos.");
        }
    }

}
