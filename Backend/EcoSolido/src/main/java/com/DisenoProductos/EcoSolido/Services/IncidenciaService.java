package com.DisenoProductos.EcoSolido.Integrations;

import com.DisenoProductos.EcoSolido.Services.HuggingFaceException;
import org.springframework.beans.factory.annotation.Value;

import org.springframework.stereotype.Service;
import org.springframework.web.reactive.function.client.WebClient;

import java.util.List;
import java.util.Map;

@Service
public class IncidenciaService  {
    @Autowired
    public IncidenciaRepository incidenciaRepository;
    @Autowired
    public CloudinaryIntegration cloudinaryIntegration;
    @Autowired
    public HuggingFaceIntegration huggingFaceIntegration;
    public IncidenciaEntity registrarIncidencia(IncidenciaRequestDTO incidenciaDTO, List<MultipartFile> fotos) throws IOException {
        IncidenciaEntity incidencia=new IncidenciaEntity();
        incidencia.setDescripcion(incidenciaDTO.getDescripcion());
        incidencia.setCategoria(incidenciaDTO.getCategoria());
        List<IncidenciaFotoEntity> fotosEntidad=new ArrayList<>();
        for(MultipartFile foto:fotos){
            Map resultado=cloudinaryIntegration.subir(foto);
            IncidenciaFotoEntity fotoEntidad=new IncidenciaFotoEntity();
            fotoEntidad.setUrlFoto((String) resultado.get("secure_url"));
            fotoEntidad.setPublicId((String) resultado.get("public_id"));
            fotoEntidad.setIncidencia(incidencia);
            fotosEntidad.add(fotoEntidad);
        }
        incidencia.setFotos(fotosEntidad);
        incidencia.setEstado(IncidenciaEstados.PENDIENTE);
        return incidenciaRepository.save(incidencia);
    }
    public String generarDescripcion(String urlFoto){
        try{
            return huggingFaceIntegration.describirFoto(urlFoto);
        } catch(Exception e){
                throw new HuggingFaceException("No se pudo describir la foto.");
        }
    }
}
