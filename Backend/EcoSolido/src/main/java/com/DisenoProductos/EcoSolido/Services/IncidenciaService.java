package com.DisenoProductos.EcoSolido.Services;

import com.DisenoProductos.EcoSolido.Integrations.CloudinaryIntegration;
import com.DisenoProductos.EcoSolido.Integrations.HuggingFaceIntegration;
import com.DisenoProductos.EcoSolido.Models.DTOs.IncidenciaRequestDTO;
import com.DisenoProductos.EcoSolido.Models.DTOs.MetricasResponseDTO;
import com.DisenoProductos.EcoSolido.Models.DTOs.SeguirIncidenciaResponseDTO;
import com.DisenoProductos.EcoSolido.Models.Entities.IncidenciaEntity;
import com.DisenoProductos.EcoSolido.Models.Entities.IncidenciaFotoEntity;
import com.DisenoProductos.EcoSolido.Models.Entities.UsuarioEntity;
import com.DisenoProductos.EcoSolido.Models.States.IncidenciaEstados;
import com.DisenoProductos.EcoSolido.Repositories.IncidenciaRepository;
import java.io.IOException;
import java.util.Map;

import com.DisenoProductos.EcoSolido.Repositories.UsuarioRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
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
    public IncidenciaEntity registrarIncidencia(IncidenciaRequestDTO incidenciaDTO,
                                                List<MultipartFile> fotos,
                                                List<String> urlsFotos,String nombreUsuario) throws IOException {
        UsuarioEntity usuario = usuarioRepository.findByNombreUsuario(nombreUsuario)
                .orElseThrow(() -> new RuntimeException("Usuario no encontrado"));
        IncidenciaEntity incidencia = new IncidenciaEntity();
        incidencia.setDescripcion(incidenciaDTO.getDescripcion());
        incidencia.setCategoria(incidenciaDTO.getCategoria());
        incidencia.setUsuario(usuario);
        String titulo;
        try {
            titulo = huggingFaceIntegration.generarTitulo(incidenciaDTO.getDescripcion());
        } catch (Exception e) {
            e.printStackTrace();
            titulo = "Incidencia #"+incidenciaDTO.getCategoria(); // Fallback si la IA falla
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
        return incidenciaRepository.save(incidencia);
    }
    public String generarDescripcion(List<String> urlFotos){
        try{
            return huggingFaceIntegration.describirFotos(urlFotos);
        } catch(Exception e){
                throw new HuggingFaceException("No se pudo describir la foto.",e);
        }
    }
    public List<String> subirFotos(List<MultipartFile> fotos) throws IOException {
        List<String> urls = new ArrayList<>();
        for (MultipartFile foto : fotos) {
            Map resultado = cloudinaryIntegration.subir(foto);
            urls.add((String) resultado.get("secure_url"));
        }
        return urls;
    }
    public List<SeguirIncidenciaResponseDTO> mostrarIncidencias(String nombreUsuario){
        List<IncidenciaEntity> incidencias=incidenciaRepository.findByUsuario_NombreUsuario(nombreUsuario);
        return incidencias.stream().map(incidencia->{
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
            return muestraIncidencia;
        }).collect(Collectors.toList());
    }
    public MetricasResponseDTO obtenerMetricas(String nombreUsuario) {
        long total = incidenciaRepository.countByUsuario_NombreUsuario(nombreUsuario);
        long resueltas = incidenciaRepository.countByUsuario_NombreUsuarioAndEstado(nombreUsuario, IncidenciaEstados.RESUELTO);
        long enProceso = incidenciaRepository.countByUsuario_NombreUsuarioAndEstado(nombreUsuario, IncidenciaEstados.EN_PROCESO);
        long pendientes = incidenciaRepository.countByUsuario_NombreUsuarioAndEstado(nombreUsuario, IncidenciaEstados.PENDIENTE);

        MetricasResponseDTO dto = new MetricasResponseDTO();
        dto.setTotal(total);
        dto.setResueltas(resueltas);
        dto.setEnProceso(enProceso);
        dto.setPendientes(pendientes);
        return dto;
    }
}
