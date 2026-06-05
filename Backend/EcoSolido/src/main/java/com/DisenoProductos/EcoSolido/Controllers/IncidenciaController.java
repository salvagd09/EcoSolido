package com.DisenoProductos.EcoSolido.Controllers;

import com.DisenoProductos.EcoSolido.Services.IncidenciaService;
import com.DisenoProductos.EcoSolido.Models.DTOs.IncidenciaRequestDTO;
import jakarta.validation.Valid;
import org.springframework.http.ResponseEntity;
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
    @PostMapping("/registrar")
    public ResponseEntity<?> logroRegistrarIncidencia(@RequestPart("incidencia") @Valid IncidenciaRequestDTO incidenciaDTO, @RequestPart(value = "fotos", required=false) List<MultipartFile> fotos,@RequestParam(value = "urlsFotos", required = false) List<String> urlsFotos) throws Exception {
        if ((fotos == null || fotos.isEmpty()) && (urlsFotos == null || urlsFotos.isEmpty())) {
            return ResponseEntity.badRequest()
                    .body("No se ha podido registrar su incidencia. Debe colocar al menos 1 foto");
        }

        incidenciaService.registrarIncidencia(incidenciaDTO, fotos, urlsFotos);
        return ResponseEntity.ok("Su incidencia ha sido registrada exitosamente y ha sido establecida como Pendiente en el panel de 'Seguimiento de Incidencias'");
    }
    
    @PostMapping("/generar-descripcion")
    public ResponseEntity<?> generarDescripcion(@RequestParam("foto") MultipartFile foto){
        if(foto==null || foto.isEmpty()){
            return ResponseEntity.badRequest().body("Debe adjuntar al menos 1 foto");
        }
        try {
            String descripcion = incidenciaService.generarDescripcion(foto);
            return ResponseEntity.ok(Map.of("descripcion", descripcion));
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