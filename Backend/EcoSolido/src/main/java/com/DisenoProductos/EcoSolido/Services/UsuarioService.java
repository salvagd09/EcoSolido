package com.DisenoProductos.EcoSolido.Services;

import com.DisenoProductos.EcoSolido.Integrations.RENIECIntegration;
import com.DisenoProductos.EcoSolido.Models.DTOs.*;
import com.DisenoProductos.EcoSolido.Models.Entities.UsuarioEntity;
import com.DisenoProductos.EcoSolido.Models.States.Rol;
import com.DisenoProductos.EcoSolido.Repositories.UsuarioRepository;
import com.DisenoProductos.EcoSolido.Security.JwtUtil;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.Objects;
import java.util.Optional;

@Service
public class UsuarioService {
    @Autowired
    private final UsuarioRepository usuarioRepository;
    @Autowired
    private final RENIECIntegration reniecIntegration;
    @Autowired
    private JwtUtil jwtUtil;
    public UsuarioService(UsuarioRepository usuarioRepository, RENIECIntegration reniecIntegration) {
        this.usuarioRepository = usuarioRepository;
        this.reniecIntegration = reniecIntegration;
    }
    public UsuarioEntity registrarUsuario(CrearUsuarioRequestDTO usuarioRequestDTO) throws Exception {
        UsuarioEntity usuario = new UsuarioEntity();
        usuario.setNombreCompleto(usuarioRequestDTO.getNombreCompleto());
        usuario.setApellidoCompleto(usuarioRequestDTO.getApellidoCompleto());
        usuario.setDni(usuarioRequestDTO.getDni());
        usuario.setNombreUsuario(usuarioRequestDTO.getNombreUsuario());
        usuario.setContrasena(usuarioRequestDTO.getContrasena());
        usuario.setTelefono(usuarioRequestDTO.getTelefono());
        usuario.setCorreoElectronico(usuarioRequestDTO.getCorreoElectronico());
        usuario.setPreguntaSeguridad(usuarioRequestDTO.getPreguntaSeguridad());
        usuario.setRespuestaPregunta(usuarioRequestDTO.getRespuestaPregunta().toLowerCase());
        usuario.setRol(Rol.CIUDADANO);
        if (!reniecIntegration.validarDni(usuario.getDni(),
                usuario.getNombreCompleto(),
                usuario.getApellidoCompleto())) {
            throw new RuntimeException("El DNI no coincide con los nombres y apellidos en RENIEC");
        }
        return usuarioRepository.save(usuario);
    }
    private LoginRequestDTO loginRequest(String nombreUsuario,String contrasena){
        LoginRequestDTO requestDTO=new LoginRequestDTO();
        requestDTO.setNombreUsuario(nombreUsuario);
        requestDTO.setContrasena(contrasena);
        return requestDTO;
    }
    public LoginResponseDTO autenticarUsuario(String nombreUsuario, String contrasena){
        LoginRequestDTO requestDTO=loginRequest(nombreUsuario, contrasena);
        UsuarioEntity usuario = usuarioRepository
                .findByNombreUsuario(requestDTO.getNombreUsuario())
                .orElseThrow(() -> new RuntimeException("Usuario no encontrado"));
        if (!usuario.getContrasena().equals(requestDTO.getContrasena())) {
            throw new RuntimeException("Contraseña incorrecta");
        }
        String nuevoToken = jwtUtil.generarToken(usuario.getNombreUsuario());
        return new LoginResponseDTO(nuevoToken, usuario.getNombreUsuario(),usuario.getRol(),usuario.getPuntos());
    }
    public VerificarCorreoTelResponseDTO verificarCorreoOTelefono(VerificarCorreoTelRequestDTO requestDTO) {
        boolean existe;
        if (requestDTO.getCorreo() != null && !requestDTO.getCorreo().isEmpty()) {
            existe = usuarioRepository.existsByCorreoElectronico(requestDTO.getCorreo());
        } else {
            existe = usuarioRepository.existsByTelefono(requestDTO.getTelefono());
        }
        VerificarCorreoTelResponseDTO response = new VerificarCorreoTelResponseDTO();
        response.setEstaRegistrado(existe);
        return response;
    }
    public String obtenerPreguntaSeguridad(VerificarCorreoTelRequestDTO requestDTO) {
        Optional<UsuarioEntity> usuario;
        if (requestDTO.getCorreo() != null && !requestDTO.getCorreo().isEmpty()) {
            usuario = usuarioRepository.findByCorreoElectronico(requestDTO.getCorreo());
        } else {
            usuario = usuarioRepository.findByTelefono(requestDTO.getTelefono());
        }
        return usuario
                .map(UsuarioEntity::getPreguntaSeguridad)
                .orElseThrow(() -> new RuntimeException("Usuario no encontrado"));
    }
    public Optional<UsuarioEntity> obtenerUsuarioPorNombreUsuario(String nombreUsuario) {
        return usuarioRepository.findByNombreUsuario(nombreUsuario);
    }

    public RespuestaSeguridadResponseDTO verificarRespuesta(RespuestaSeguridadRequestDTO requestDTO){
        Optional<UsuarioEntity> usuarioOpt;
        if (requestDTO.getCorreo() != null && !requestDTO.getCorreo().isEmpty()) {
            usuarioOpt = usuarioRepository.findByCorreoElectronico(requestDTO.getCorreo());
        } else {
            usuarioOpt = usuarioRepository.findByTelefono(requestDTO.getTelefono());
        }
        UsuarioEntity usuario = usuarioOpt
                .orElseThrow(() -> new RuntimeException("Usuario no encontrado"));
        boolean coinciden = usuario.getRespuestaPregunta()
                .equalsIgnoreCase(requestDTO.getRespuesta().toLowerCase());
        RespuestaSeguridadResponseDTO response = new RespuestaSeguridadResponseDTO();
        response.setCoinciden(coinciden);
        return response;
    }
    public RestablecerContrasenaResponseDTO restablecerContrasena(RestablecerContrasenaRequestDTO requestDTO){
        RestablecerContrasenaResponseDTO response = new RestablecerContrasenaResponseDTO();
        if (!Objects.equals(requestDTO.getNuevaContrasena(), requestDTO.getNuevaContrasenaRepetida())) {
            response.setExito(false);
            throw new RuntimeException("Las contraseñas no coinciden");
        }
        Optional<UsuarioEntity> usuarioOpt;
        if (requestDTO.getCorreo() != null && !requestDTO.getCorreo().isEmpty()) {
            usuarioOpt = usuarioRepository.findByCorreoElectronico(requestDTO.getCorreo());
        } else {
            usuarioOpt = usuarioRepository.findByTelefono(requestDTO.getTelefono());
        }
        UsuarioEntity usuario = usuarioOpt
                .orElseThrow(() -> new RuntimeException("Usuario no encontrado"));
        usuario.setContrasena(requestDTO.getNuevaContrasena());
        usuarioRepository.save(usuario);
        response.setExito(true);
        return response;
    }
}
