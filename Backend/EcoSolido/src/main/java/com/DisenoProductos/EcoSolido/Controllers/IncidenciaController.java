package com.DisenoProductos.EcoSolido.Controllers;

import com.DisenoProductos.EcoSolido.Models.DTOs.SeguirIncidenciaResponseDTO;
import com.DisenoProductos.EcoSolido.Models.Entities.UsuarioEntity;
import com.DisenoProductos.EcoSolido.Services.IncidenciaService;
import com.DisenoProductos.EcoSolido.Models.DTOs.DescribirFotosRequestDTO;
import com.DisenoProductos.EcoSolido.Models.DTOs.DescribirFotosResponseDTO;
import com.DisenoProductos.EcoSolido.Models.DTOs.IncidenciaRequestDTO;
import com.DisenoProductos.EcoSolido.Services.UsuarioService;
import jakarta.validation.Valid;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/incidencias")
public class IncidenciaController {

    private final IncidenciaService incidenciaService;
    private final UsuarioService usuarioService;
    public IncidenciaController(IncidenciaService incidenciaService, UsuarioService usuarioService) {
        this.incidenciaService = incidenciaService;
        this.usuarioService = usuarioService;
    }
    @GetMapping("/seguir")
    public ResponseEntity<?> mostrarIncidencias(Authentication authentication) {
        String userName = authentication.getName();
        return ResponseEntity.ok(incidenciaService.mostrarIncidencias(userName));
    }
    @GetMapping("/mostrarT")
    public ResponseEntity<?> mostrarTodoIncidencias() {
        return ResponseEntity.ok(incidenciaService.mostrarIncidenciasTotales());
    }
    @PostMapping("/registrar")
    public ResponseEntity<?> logroRegistrarIncidencia(
            @RequestPart("incidencia") @Valid IncidenciaRequestDTO incidenciaDTO,
            @RequestPart(value = "fotos", required = false) List<MultipartFile> fotos,
            @RequestParam(value = "urlsFotos", required = false) List<String> urlsFotos,
            Authentication authentication) throws Exception {
        if ((fotos == null || fotos.isEmpty()) && (urlsFotos == null || urlsFotos.isEmpty())) {
            return ResponseEntity.badRequest().body("Debe adjuntar al menos una foto para registrar la incidencia.");
        }
        String nombreUsuario = authentication.getName();

        var nuevasInsignias = incidenciaService.registrarIncidencia(incidenciaDTO, fotos, urlsFotos, nombreUsuario);
        List<Map<String, Object>> nuevasInsigniasDTO = nuevasInsignias.stream()
                .map(insignia -> {
                    Map<String, Object> map = new HashMap<>();
                    map.put("nombre", insignia.getNombre());
                    map.put("recompensa", insignia.getRecompensa() != null ? insignia.getRecompensa() : "");
                    return map;
                })
                .collect(Collectors.toList());

        return ResponseEntity.ok(Map.of(
                "mensaje", "Su incidencia ha sido registrada exitosamente...",
                "puntosGanados", incidenciaService.getPuntosPorIncidencia(),
                "nuevasInsignias", nuevasInsigniasDTO
        ));
    }
    @GetMapping("/metricas")
    public ResponseEntity<?> mostrarMetricas(Authentication authentication){
        String userName=authentication.getName();
        return ResponseEntity.ok(incidenciaService.obtenerMetricas(userName));
    }
    @PostMapping("/generar-descripcion")
    public ResponseEntity<?> generarDescripcion(@RequestBody DescribirFotosRequestDTO request){
        if (request.getImagenes() == null || request.getImagenes().isEmpty()) {
            return ResponseEntity.badRequest().body("Debe adjuntar al menos 1 foto para generar una descripciÃ³n.");
        }
        try {
            String descripcion = incidenciaService.generarDescripcion(request.getImagenes());
            return ResponseEntity.ok(new DescribirFotosResponseDTO(descripcion));
        } catch (Exception e) {
            return ResponseEntity.internalServerError().body("Ocurrio un error al procesar las imagenes con Inteligencia Artificial.");
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
    // HU011: Endpoint para consultar puntos del usuario autenticado
    @GetMapping("/puntos")
    public ResponseEntity<?> obtenerPuntos(Authentication authentication) {
        String nombreUsuario = authentication.getName();
        UsuarioEntity usuario = usuarioService.obtenerUsuarioPorNombreUsuario(nombreUsuario)
                .orElseThrow(() -> new RuntimeException("Usuario no encontrado"));
        return ResponseEntity.ok(Map.of("puntos", usuario.getPuntos()));
    }
}
