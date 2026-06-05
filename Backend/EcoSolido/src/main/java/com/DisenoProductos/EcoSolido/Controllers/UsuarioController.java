package com.DisenoProductos.EcoSolido.Controllers;

import com.DisenoProductos.EcoSolido.Models.DTOs.CrearUsuarioRequestDTO;
import com.DisenoProductos.EcoSolido.Models.DTOs.LoginRequestDTO;
import com.DisenoProductos.EcoSolido.Models.DTOs.LoginResponseDTO;
import com.DisenoProductos.EcoSolido.Models.Entities.UsuarioEntity;
import com.DisenoProductos.EcoSolido.Services.UsuarioService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RestController;

@RestController
public class UsuarioController {
    private final UsuarioService usuarioService;

    public UsuarioController(UsuarioService usuarioService) {
        this.usuarioService = usuarioService;
    }

    @PostMapping("/registrar")
    public ResponseEntity<?> registrarUsuario(@RequestBody CrearUsuarioRequestDTO usuarioRequestDTO) {
        try {
            UsuarioEntity usuario = usuarioService.registrarUsuario(usuarioRequestDTO);
            return ResponseEntity.status(HttpStatus.CREATED).body(usuario);
        } catch (RuntimeException e) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(e.getMessage());
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("Error interno del servidor");
        }
    }
    @PostMapping("/autenticar")
    public ResponseEntity<?> autenticarUsuario(@RequestBody LoginRequestDTO requestDTO) {
        try {
            LoginResponseDTO response = usuarioService.autenticarUsuario(
                    requestDTO.getNombreUsuario(),
                    requestDTO.getContrasena(),
                    requestDTO.getToken()
            );
            return ResponseEntity.ok(response);
        } catch (RuntimeException e) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(e.getMessage());
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("Error interno del servidor");
        }
    }
}
