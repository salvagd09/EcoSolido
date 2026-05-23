package com.DisenoProductos.EcoSolido.Controllers;

import com.DisenoProductos.EcoSolido.Models.Entities.IncidenciaEntity;
import com.DisenoProductos.EcoSolido.Services.IncidenciaService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.util.List;
import java.util.Map;
import java.util.Objects;

@RestController
@RequestMapping("/incidencias")
public class IncidenciaController {
    @Autowired
    public IncidenciaService incidenciaService;

    @PostMapping("/registrar")
    public ResponseEntity<?> logroRegistrarIncidencia(@RequestPart("incidencia")IncidenciaEntity incidencia, @RequestPart("fotos") List<MultipartFile> fotos) {
        if(fotos==null || fotos.isEmpty()){
            return ResponseEntity.badRequest().body("No se ha podido registrar su incidencia. Debe colocar al menos 1 foto");
        }
        else if(Objects.equals(incidencia.getCategoria(), "Seleccione una opción")){
            return ResponseEntity.badRequest().body("No se ha podido registrar su incidencia. Debe establecer la categoría de la incidencia");
        }
        else if(incidencia.getDescripcion() == null || incidencia.getDescripcion().isBlank()){
            return ResponseEntity.badRequest().body("No se ha podido registrar su incidencia. Debe colocar su  descripción.");
        }
        try{
            incidenciaService.registrarIncidencia(incidencia,fotos);
            return ResponseEntity.ok("Su incidencia ha sido registrada exitosamente y ha sido establecida como Pendiente en el panel de 'Seguimiento de Incidencias'");
        } catch(IOException e){
            return ResponseEntity.internalServerError()
                    .body("Ocurrió un error inesperado al registrar la incidencia");
        }
    }
    @PostMapping("/generar-descripcion")
    public ResponseEntity<?> generarDescripcion(@RequestParam("urlFoto") String urlFoto){
        if(urlFoto==null || urlFoto.isBlank()){
            return ResponseEntity.badRequest().body("Debe adjuntar al menos 1 foto");
        }
        String descripcion= incidenciaService.generarDescripcion(urlFoto);
        return ResponseEntity.ok(Map.of("descripcion",descripcion));
    }

}
