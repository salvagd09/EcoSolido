package com.DisenoProductos.EcoSolido.Controllers;

import com.DisenoProductos.EcoSolido.Services.IncidenciaService;
import com.DisenoProductos.EcoSolido.Models.DTOs.DescribirFotosRequestDTO;
import com.DisenoProductos.EcoSolido.Models.DTOs.DescribirFotosResponseDTO;
import com.DisenoProductos.EcoSolido.Models.DTOs.IncidenciaRequestDTO;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/incidencias")
public class IncidenciaController {
    @Autowired
    public IncidenciaService incidenciaService;

    @PostMapping("/registrar")
    public ResponseEntity<?> logroRegistrarIncidencia(@RequestPart("incidencia") @Valid IncidenciaRequestDTO incidenciaDTO, @RequestPart("fotos") List<MultipartFile> fotos) throws Exception {
        if(fotos==null || fotos.isEmpty()){
            return ResponseEntity.badRequest().body("No se ha podido registrar su incidencia. Debe colocar al menos 1 foto");
        }
        try{
            incidenciaService.registrarIncidencia(incidenciaDTO,fotos);
            return ResponseEntity.ok("Su incidencia ha sido registrada exitosamente y ha sido establecida como Pendiente en el panel de 'Seguimiento de Incidencias'");
        } catch(Exception e){
            throw e;
        }
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

}
