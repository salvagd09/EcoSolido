package com.DisenoProductos.EcoSolido.Services;

import com.DisenoProductos.EcoSolido.Models.DTOs.InsigniaResponseDTO;
import com.DisenoProductos.EcoSolido.Models.Entities.InsigniaEntity;
import com.DisenoProductos.EcoSolido.Models.Entities.UsuarioEntity;
import com.DisenoProductos.EcoSolido.Models.Entities.UsuarioInsigniaEntity;
import com.DisenoProductos.EcoSolido.Repositories.InsigniaRepository;
import com.DisenoProductos.EcoSolido.Repositories.IncidenciaRepository;
import com.DisenoProductos.EcoSolido.Repositories.UsuarioInsigniaRepository;
import com.DisenoProductos.EcoSolido.Repositories.UsuarioRepository;
import jakarta.annotation.PostConstruct;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.ArrayList;
import java.util.List;
import java.util.Map;
import java.util.Set;
import java.util.stream.Collectors;

@Service
public class InsigniaService {

    @Autowired
    private InsigniaRepository insigniaRepository;

    @Autowired
    private UsuarioInsigniaRepository usuarioInsigniaRepository;

    @Autowired
    private UsuarioRepository usuarioRepository;

    @Autowired
    private IncidenciaRepository incidenciaRepository;

    // Insignias predefinidas del sistema
    @PostConstruct
    public void inicializarInsignias() {
        if (insigniaRepository.count() == 0) {
            crearInsignia("Primer reporte", "¡Felicidades! Has registrado tu primera incidencia y comenzado a transformar tu comunidad.", "🌱", 1,
                    "Bono de S/20 en tu billetera digital para canjear en mercados locales.");
            crearInsignia("Reportero activo", "Has registrado 5 incidencias. Tu compromiso con el medio ambiente es notable.", "📢", 5,
                    "Bono de S/50 en tu billetera digital + recarga de 10 GB móviles.");
            crearInsignia("Guardián del barrio", "Has registrado 10 incidencias. Eres un referente de cuidado ambiental en tu zona.", "🛡️", 10,
                    "Vale de S/100 en canasta familiar + reconocimiento público en redes sociales.");
            crearInsignia("EcoHéroe", "Has registrado 15 incidencias. Tu dedicación es inspiradora para toda la comunidad.", "🏆", 15,
                    "Vale de S/200 en canasta familiar + kit de productos ecológicos para el hogar.");
            crearInsignia("Embajador EcoSólido", "Has registrado 20 incidencias. Eres un embajador del cambio ambiental.", "🌍", 20,
                    "Vale de S/500 en canasta familiar + kit EcoSólido + certificado de Embajador Ambiental.");
        }
    }

    private void crearInsignia(String nombre, String descripcion, String icono, int requisito, String recompensa) {
        InsigniaEntity insignia = new InsigniaEntity();
        insignia.setNombre(nombre);
        insignia.setDescripcion(descripcion);
        insignia.setIcono(icono);
        insignia.setRequisitoIncidencias(requisito);
        insignia.setRecompensa(recompensa);
        insigniaRepository.save(insignia);
    }

    @Transactional
    public List<InsigniaResponseDTO> obtenerInsigniasDelUsuario(String nombreUsuario) {
        UsuarioEntity usuario = usuarioRepository.findByNombreUsuario(nombreUsuario)
                .orElseThrow(() -> new RuntimeException("Usuario no encontrado"));

        List<InsigniaEntity> todasLasInsignias = insigniaRepository.findAll();
        List<UsuarioInsigniaEntity> insigniasDesbloqueadas = usuarioInsigniaRepository.findByUsuario_IdUsuario(usuario.getIdUsuario());

        Map<Integer, UsuarioInsigniaEntity> mapaDesbloqueadas = insigniasDesbloqueadas.stream()
                .collect(Collectors.toMap(ui -> ui.getInsignia().getIdInsignia(), ui -> ui));

        return todasLasInsignias.stream().map(insignia -> {
            UsuarioInsigniaEntity desbloqueada = mapaDesbloqueadas.get(insignia.getIdInsignia());
            return new InsigniaResponseDTO(
                    insignia.getIdInsignia(),
                    insignia.getNombre(),
                    insignia.getDescripcion(),
                    insignia.getIcono(),
                    insignia.getRequisitoIncidencias(),
                    insignia.getRecompensa(),
                    desbloqueada != null,
                    desbloqueada != null ? desbloqueada.getFechaDesbloqueo() : null
            );
        }).collect(Collectors.toList());
    }

    @Transactional
    public List<InsigniaEntity> evaluarYDesbloquearInsignias(String nombreUsuario) {
        UsuarioEntity usuario = usuarioRepository.findByNombreUsuario(nombreUsuario)
                .orElseThrow(() -> new RuntimeException("Usuario no encontrado"));

        long totalIncidencias = incidenciaRepository.countByUsuario_NombreUsuario(nombreUsuario);
        List<InsigniaEntity> todasLasInsignias = insigniaRepository.findAll();

        List<UsuarioInsigniaEntity> yaDesbloqueadas = usuarioInsigniaRepository.findByUsuario_IdUsuario(usuario.getIdUsuario());
        Set<Integer> idsDesbloqueadas = yaDesbloqueadas.stream()
                .map(ui -> ui.getInsignia().getIdInsignia())
                .collect(Collectors.toSet());

        List<InsigniaEntity> nuevasInsignias = new ArrayList<>();

        for (InsigniaEntity insignia : todasLasInsignias) {
            if (!idsDesbloqueadas.contains(insignia.getIdInsignia())
                    && totalIncidencias >= insignia.getRequisitoIncidencias()) {
                UsuarioInsigniaEntity ui = new UsuarioInsigniaEntity();
                ui.setUsuario(usuario);
                ui.setInsignia(insignia);
                usuarioInsigniaRepository.save(ui);
                nuevasInsignias.add(insignia);
            }
        }

        return nuevasInsignias;
    }
}
