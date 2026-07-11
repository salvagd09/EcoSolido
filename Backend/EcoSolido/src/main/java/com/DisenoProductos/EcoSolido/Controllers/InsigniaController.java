package com.DisenoProductos.EcoSolido.Controllers;

import com.DisenoProductos.EcoSolido.Models.DTOs.InsigniaResponseDTO;
import com.DisenoProductos.EcoSolido.Models.Entities.InsigniaEntity;
import com.DisenoProductos.EcoSolido.Services.InsigniaService;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping("/insignias")
public class InsigniaController {

    private final InsigniaService insigniaService;

    public InsigniaController(InsigniaService insigniaService) {
        this.insigniaService = insigniaService;
    }

    @GetMapping("/mis-insignias")
    public ResponseEntity<?> obtenerMisInsignias(Authentication authentication) {
        String nombreUsuario = authentication.getName();
        List<InsigniaResponseDTO> insignias = insigniaService.obtenerInsigniasDelUsuario(nombreUsuario);
        return ResponseEntity.ok(insignias);
    }
}
