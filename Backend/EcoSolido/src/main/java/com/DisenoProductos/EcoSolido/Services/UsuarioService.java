package com.DisenoProductos.EcoSolido.Services;

import com.DisenoProductos.EcoSolido.Integrations.RENIECIntegration;
import com.DisenoProductos.EcoSolido.Models.DTOs.CrearUsuarioRequestDTO;
import com.DisenoProductos.EcoSolido.Models.DTOs.LoginRequestDTO;
import com.DisenoProductos.EcoSolido.Models.DTOs.LoginResponseDTO;
import com.DisenoProductos.EcoSolido.Models.Entities.UsuarioEntity;
import com.DisenoProductos.EcoSolido.Repositories.UsuarioRepository;
import com.DisenoProductos.EcoSolido.Security.JwtUtil;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

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
        usuario.setRespuestaPregunta(usuarioRequestDTO.getRespuestaPregunta());
        if (!reniecIntegration.validarDni(usuario.getDni(),
                usuario.getNombreCompleto(),
                usuario.getApellidoCompleto())) {
            throw new RuntimeException("El DNI no coincide con los nombres y apellidos en RENIEC");
        }
        return usuarioRepository.save(usuario);
    }
    private LoginRequestDTO loginRequest(String nombreUsuario,String contrasena,String token){
        LoginRequestDTO requestDTO=new LoginRequestDTO();
        requestDTO.setNombreUsuario(nombreUsuario);
        requestDTO.setContrasena(contrasena);
        requestDTO.setToken(token);
        return requestDTO;
    }
    public LoginResponseDTO autenticarUsuario(String nombreUsuario, String contrasena, String token){
        LoginRequestDTO requestDTO=loginRequest(nombreUsuario, contrasena, token);
        String usuarioDelToken = jwtUtil.extraerNombreUsuario(requestDTO.getToken());
        if (!usuarioDelToken.equals(requestDTO.getNombreUsuario())) {
            throw new RuntimeException("Token no corresponde al usuario");
        }
        UsuarioEntity usuario = usuarioRepository
                .findByNombreUsuario(requestDTO.getNombreUsuario())
                .orElseThrow(() -> new RuntimeException("Usuario no encontrado"));
        if (!usuario.getContrasena().equals(requestDTO.getContrasena())) {
            throw new RuntimeException("Contraseña incorrecta");
        }
        String nuevoToken = jwtUtil.generarToken(usuario.getNombreUsuario());
        return new LoginResponseDTO(nuevoToken, usuario.getNombreUsuario());
    }
}
