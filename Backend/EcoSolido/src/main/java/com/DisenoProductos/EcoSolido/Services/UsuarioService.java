package com.DisenoProductos.EcoSolido.Services;

import com.DisenoProductos.EcoSolido.Integrations.ValidadorRUC;
import com.DisenoProductos.EcoSolido.Models.DTOs.*;
import com.DisenoProductos.EcoSolido.Models.Entities.UsuarioEntity;
import com.DisenoProductos.EcoSolido.Models.States.Rol;
import com.DisenoProductos.EcoSolido.Repositories.UsuarioRepository;
import com.DisenoProductos.EcoSolido.Security.JwtUtil;
import org.springframework.stereotype.Service;

import java.util.Objects;
import java.util.Optional;

@Service
public class UsuarioService {
    private static final String DISTRITO_MUNICIPALIDAD = "CARABAYLLO";

    private final UsuarioRepository usuarioRepository;
    private final ValidadorRUC validadorRUC;
    private final JwtUtil jwtUtil;

    public UsuarioService(UsuarioRepository usuarioRepository, ValidadorRUC validadorRUC, JwtUtil jwtUtil) {
        this.usuarioRepository = usuarioRepository;
        this.validadorRUC = validadorRUC;
        this.jwtUtil = jwtUtil;
    }
    public UsuarioEntity registrarUsuario(CrearUsuarioRequestDTO dto) {
        // 1. Validar primero, antes de armar la entidad
        if (usuarioRepository.existsByRuc(dto.getRuc())) {
            throw new RuntimeException("Ya existe una cuenta registrada con ese RUC");
        }
        ConsultaRucDTO datosRuc = validadorRUC.consultarRuc(dto.getRuc());
        if (!datosRuc.encontrado()) {
            throw new RuntimeException(datosRuc.mensaje());
        }
        if (!datosRuc.estaActivoYHabido()) {
            throw new RuntimeException("El RUC no está ACTIVO y HABIDO en SUNAT");
        }
        if (!datosRuc.tieneLocalEnDistrito(DISTRITO_MUNICIPALIDAD)) {
            throw new RuntimeException("La empresa no tiene un local registrado en " + DISTRITO_MUNICIPALIDAD);
        }
        if (dto.getGiro() == null) {
            throw new RuntimeException("Debe seleccionar el giro del negocio");
        }
        if (dto.getLatitud() == null || dto.getLongitud() == null) {
            throw new RuntimeException("Debe indicar la ubicación de su local");
        }
        // 2. Armar el usuario (nombre y apellido = persona de contacto)
        UsuarioEntity usuario = new UsuarioEntity();
        usuario.setRuc(datosRuc.ruc());
        usuario.setRazonSocial(datosRuc.razonSocial());
        usuario.setNombreCompleto(dto.getNombreCompleto());
        usuario.setApellidoCompleto(dto.getApellidoCompleto());
        usuario.setNombreUsuario(dto.getNombreUsuario());
        usuario.setContrasena(dto.getContrasena());
        usuario.setTelefono(dto.getTelefono());
        usuario.setGiro(dto.getGiro());
        usuario.setCorreoElectronico(dto.getCorreoElectronico());
        usuario.setPreguntaSeguridad(dto.getPreguntaSeguridad());
        usuario.setRespuestaPregunta(dto.getRespuestaPregunta().toLowerCase());
        usuario.setLatitud(dto.getLatitud());
        usuario.setLongitud(dto.getLongitud());
        usuario.setDireccionTexto(dto.getDireccionTexto());
        usuario.setRol(Rol.EMPRESA);
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
