package com.DisenoProductos.EcoSolido.Services;

import com.DisenoProductos.EcoSolido.Integrations.CloudinaryIntegration;
import com.DisenoProductos.EcoSolido.Integrations.HuggingFaceIntegration;
import com.DisenoProductos.EcoSolido.Models.DTOs.IncidenciaRequestDTO;
import com.DisenoProductos.EcoSolido.Models.DTOs.MetricasResponseDTO;
import com.DisenoProductos.EcoSolido.Models.DTOs.SeguirIncidenciaResponseDTO;
import com.DisenoProductos.EcoSolido.Models.Entities.IncidenciaEntity;
import com.DisenoProductos.EcoSolido.Models.Entities.IncidenciaFotoEntity;
import com.DisenoProductos.EcoSolido.Models.Entities.InsigniaEntity;
import com.DisenoProductos.EcoSolido.Models.Entities.UsuarioEntity;
import com.DisenoProductos.EcoSolido.Models.States.IncidenciaEstados;
import com.DisenoProductos.EcoSolido.Repositories.IncidenciaRepository;
import java.io.IOException;
import java.time.LocalDateTime;
import java.util.Map;

import com.DisenoProductos.EcoSolido.Repositories.UsuarioRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.multipart.MultipartFile;
import java.util.ArrayList;
import java.util.List;
import java.util.stream.Collectors;

@Service
public class IncidenciaService  {
    @Autowired
    public IncidenciaRepository incidenciaRepository;
    @Autowired
    public CloudinaryIntegration cloudinaryIntegration;
    @Autowired
    public HuggingFaceIntegration huggingFaceIntegration;
    @Autowired
    public UsuarioRepository usuarioRepository;
    @Autowired
    public InsigniaService insigniaService;
    private static final int PUNTOS_POR_INCIDENCIA = 10;

    public int getPuntosPorIncidencia() {
        return PUNTOS_POR_INCIDENCIA;
    }

    private double calcularDistancia(double lat1, double lon1, double lat2, double lon2) {
        int R = 6371000; // Radio de la Tierra en metros
        double phi1 = Math.toRadians(lat1);
        double phi2 = Math.toRadians(lat2);
        double deltaPhi = Math.toRadians(lat2 - lat1);
        double deltaLambda = Math.toRadians(lon2 - lon1);

        double a = Math.sin(deltaPhi / 2) * Math.sin(deltaPhi / 2) +
                Math.cos(phi1) * Math.cos(phi2) *
                Math.sin(deltaLambda / 2) * Math.sin(deltaLambda / 2);
        double c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));

        return R * c; // en metros
    }

    @Transactional
    public List<InsigniaEntity> registrarIncidencia(IncidenciaRequestDTO incidenciaDTO,
                                                      List<MultipartFile> fotos,
                                                      List<String> urlsFotos, String nombreUsuario) throws IOException {
        boolean tieneUrls = urlsFotos != null && !urlsFotos.isEmpty();
        boolean tieneArchivos = fotos != null && !fotos.isEmpty() && fotos.stream().anyMatch(f -> !f.isEmpty());

        if (!tieneUrls && !tieneArchivos) {
            // Tu GlobalExceptionHandler captura IllegalStateException y devuelve un HTTP 500 con este mensaje
            throw new IllegalStateException("Debe adjuntar al menos 1 foto");
        }
        UsuarioEntity usuario = usuarioRepository.findByNombreUsuario(nombreUsuario)
                .orElseThrow(() -> new RuntimeException("Usuario no encontrado"));

        // HU011: Validar incidencia duplicada (50m)
        List<IncidenciaEntity> posiblesDuplicados = incidenciaRepository.findByUsuario_NombreUsuarioAndCategoriaAndDescripcion(
                nombreUsuario,
                incidenciaDTO.getCategoria(),
                incidenciaDTO.getDescripcion()
        );
        for (IncidenciaEntity prev : posiblesDuplicados) {
            double distancia = calcularDistancia(prev.getLatitud(), prev.getLongitud(), incidenciaDTO.getLatitud(), incidenciaDTO.getLongitud());
            if (distancia <= 50.0) {
                throw new DuplicateIncidentException("Esta incidencia ya fue registrada anteriormente. No se asignarán puntos adicionales.");
            }
        }

        IncidenciaEntity incidencia = new IncidenciaEntity();
        incidencia.setDescripcion(incidenciaDTO.getDescripcion());
        incidencia.setCategoria(incidenciaDTO.getCategoria());
        incidencia.setUsuario(usuario);
        String titulo;
        /* Mejora para tener código eficiente:
        Validar longitud de texto para evitar peticiones vacías a la IA (Llama)*/
        if (incidenciaDTO.getDescripcion() != null && incidenciaDTO.getDescripcion().trim().length() > 5) {
            try {
                titulo = huggingFaceIntegration.generarTitulo(incidenciaDTO.getDescripcion());
            } catch (Exception e) {
                titulo = "Incidencia #" + incidenciaDTO.getCategoria();
            }
        } else {
            titulo = "Incidencia #" + incidenciaDTO.getCategoria();
        }
        incidencia.setTitulo(titulo);
        List<IncidenciaFotoEntity> fotosEntidad = new ArrayList<>();

        if (urlsFotos != null && !urlsFotos.isEmpty()) {
            // Usó IA, ya están en Cloudinary
            for (String url : urlsFotos) {
                IncidenciaFotoEntity fotoEntidad = new IncidenciaFotoEntity();
                fotoEntidad.setUrlFoto(url);
                fotoEntidad.setIncidencia(incidencia);
                fotosEntidad.add(fotoEntidad);
            }
        } else {
            // No usó IA, subir fotos a Cloudinary
            for (MultipartFile foto : fotos) {
                Map resultado = cloudinaryIntegration.subir(foto);
                IncidenciaFotoEntity fotoEntidad = new IncidenciaFotoEntity();
                fotoEntidad.setUrlFoto((String) resultado.get("secure_url"));
                fotoEntidad.setPublicId((String) resultado.get("public_id"));
                fotoEntidad.setIncidencia(incidencia);
                fotosEntidad.add(fotoEntidad);
            }
        }
        incidencia.setFotos(fotosEntidad);
        incidencia.setEstado(IncidenciaEstados.PENDIENTE);
        incidencia.setLatitud(incidenciaDTO.getLatitud());
        incidencia.setLongitud(incidenciaDTO.getLongitud());
        incidencia.setDireccionTexto(incidenciaDTO.getDireccionTexto());
        incidenciaRepository.save(incidencia);

        // HU011: Asignar puntos al usuario
        usuario.setPuntos(usuario.getPuntos() + PUNTOS_POR_INCIDENCIA);
        usuarioRepository.save(usuario);

        // HU012: Evaluar y desbloquear insignias
        return insigniaService.evaluarYDesbloquearInsignias(nombreUsuario);
    }
    public String generarDescripcion(List<String> urlFotos){
        /* Mejora para tener código eficiente:
        Validar que existan fotos antes de realizar llamadas a la GPU de Hugging Face*/
        if (urlFotos == null || urlFotos.isEmpty()) {
            return "No se proporcionaron imágenes.";
        }
        try {
            return huggingFaceIntegration.describirFotos(urlFotos);
        } catch (Exception e) {
            throw new HuggingFaceException("No se pudo describir la foto.", e);
        }
    }
    public List<String> subirFotos(List<MultipartFile> fotos) throws IOException {
        List<String> urls = new ArrayList<>();
        for (MultipartFile foto : fotos) {
            Map resultado = cloudinaryIntegration.subir(foto);
            String secureUrl = (String) resultado.get("secure_url");
            // Mejora de código eficiente: Modifica la URL para
            // forzar formatos livianos (WebP/AVIF) y compresión inteligente (q_auto)
            // de modo que el ciudadano gaste menos datos móviles al navegar y cargar la app.
            String urlOptimizada = secureUrl.replace("/upload/", "/upload/f_auto,q_auto/");
            urls.add(urlOptimizada);
        }
        return urls;
    }
    public List<SeguirIncidenciaResponseDTO> mostrarIncidencias(String nombreUsuario){
        List<IncidenciaEntity> incidencias=incidenciaRepository.findByUsuario_NombreUsuarioConFotos(nombreUsuario);
        return incidencias.stream().distinct().map(incidencia->{
            SeguirIncidenciaResponseDTO muestraIncidencia=new SeguirIncidenciaResponseDTO();
            muestraIncidencia.setIdIncidencia(incidencia.getIdIncidencia());
            muestraIncidencia.setDescripcion(incidencia.getDescripcion());
            muestraIncidencia.setEstado(incidencia.getEstado().name());
            muestraIncidencia.setTitulo(incidencia.getTitulo());
            muestraIncidencia.setFecha(incidencia.getFecha().toString());
            muestraIncidencia.setUrlsImagenes(
                    incidencia.getFotos().stream()
                            .map(IncidenciaFotoEntity::getUrlFoto)
                            .collect(Collectors.toList())
            );
            muestraIncidencia.setDireccionTexto(incidencia.getDireccionTexto());
            return muestraIncidencia;
        }).collect(Collectors.toList());
    }
    public MetricasResponseDTO obtenerMetricas(String nombreUsuario) {
        long total = incidenciaRepository.countByUsuario_NombreUsuario(nombreUsuario);
        long enProceso = incidenciaRepository.countByUsuario_NombreUsuarioAndEstado(nombreUsuario, IncidenciaEstados.EN_PROCESO);
        long pendientes = incidenciaRepository.countByUsuario_NombreUsuarioAndEstado(nombreUsuario, IncidenciaEstados.PENDIENTE);
        long resueltos = incidenciaRepository.countByUsuario_NombreUsuarioAndEstado(nombreUsuario, IncidenciaEstados.RESUELTO);
        LocalDateTime inicioMes = LocalDateTime.now().withDayOfMonth(1).withHour(0).withMinute(0);
        long incidenciasEsteMes = incidenciaRepository.countDesdeFecha(nombreUsuario, inicioMes);
        MetricasResponseDTO dto = new MetricasResponseDTO();
        dto.setTotal(total);
        dto.setEnProceso(enProceso);
        dto.setPendientes(pendientes);
        dto.setResueltos(resueltos);
        dto.setIncidenciasEsteMes(incidenciasEsteMes);
        return dto;
    }
}
