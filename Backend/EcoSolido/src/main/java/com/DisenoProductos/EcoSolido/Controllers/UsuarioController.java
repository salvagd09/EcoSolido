package com.DisenoProductos.EcoSolido.Controllers;

import com.DisenoProductos.EcoSolido.Models.DTOs.*;
import com.DisenoProductos.EcoSolido.Models.Entities.UsuarioEntity;
import com.DisenoProductos.EcoSolido.Services.UsuarioService;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@RequestMapping("/usuario")
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
            e.printStackTrace();
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("Error interno del servidor");
        }
    }
    @PostMapping("/autenticar")
    public ResponseEntity<?> autenticarUsuario(@RequestBody LoginRequestDTO requestDTO) {
        try {
            LoginResponseDTO response = usuarioService.autenticarUsuario(
                    requestDTO.getNombreUsuario(),
                    requestDTO.getContrasena()
            );
            return ResponseEntity.ok(response);
        } catch (RuntimeException e) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(e.getMessage());
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("Error interno del servidor");
        }
    }
    @PostMapping("/verificar-cor-o-tel")
    public ResponseEntity<?> verificarCorrOTel(@RequestBody VerificarCorreoTelRequestDTO requestDTO) {
        VerificarCorreoTelResponseDTO response = usuarioService.verificarCorreoOTelefono(requestDTO);
        return ResponseEntity.ok(response);
    }
    @GetMapping("/pregunta-seguridad")
    public ResponseEntity<?> preguntaSeguridad(
            @RequestParam(required = false) String correo,
            @RequestParam(required = false) String telefono) {
        try {
            VerificarCorreoTelRequestDTO requestDTO = new VerificarCorreoTelRequestDTO();
            requestDTO.setCorreo(correo);
            requestDTO.setTelefono(telefono);

            String pregunta = usuarioService.obtenerPreguntaSeguridad(requestDTO);
            return ResponseEntity.ok(Map.of("pregunta", pregunta));
        } catch (RuntimeException e) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(e.getMessage());
        }
    }
    @PostMapping("/verificar-respuesta")
    public ResponseEntity<?> verificarRespuesta(@RequestBody RespuestaSeguridadRequestDTO requestDTO2){
        RespuestaSeguridadResponseDTO response=usuarioService.verificarRespuesta(requestDTO2);
        return ResponseEntity.ok(response);
    }
    @PatchMapping("/restablecer-contrasena")
    public ResponseEntity<?> restablecerContrasena(@RequestBody RestablecerContrasenaRequestDTO requestDTO3) {
        try {
            RestablecerContrasenaResponseDTO response = usuarioService.restablecerContrasena(requestDTO3);
            return ResponseEntity.ok(response);
        } catch (RuntimeException e) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(e.getMessage());
        }
    }


}
