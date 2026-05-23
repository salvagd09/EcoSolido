package com.DisenoProductos.EcoSolido.Services;

import com.DisenoProductos.EcoSolido.Integrations.CloudinaryIntegration;
import com.DisenoProductos.EcoSolido.Integrations.HuggingFaceIntegration;
import com.DisenoProductos.EcoSolido.Models.Entities.IncidenciaEntity;
import com.DisenoProductos.EcoSolido.Models.Entities.IncidenciaFotoEntity;
import com.DisenoProductos.EcoSolido.Models.States.IncidenciaEstados;
import com.DisenoProductos.EcoSolido.Repositories.IncidenciaRepository;
import java.io.IOException;
import java.util.Map;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;
import java.util.ArrayList;
import java.util.List;

@Service
public class IncidenciaService  {
    @Autowired
    public IncidenciaRepository incidenciaRepository;
    @Autowired
    public CloudinaryIntegration cloudinaryIntegration;
    @Autowired
    public HuggingFaceIntegration huggingFaceIntegration;
    public IncidenciaEntity registrarIncidencia(IncidenciaEntity incidencia, List<MultipartFile> fotos) throws IOException {
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
            return "Lo siento, no pude ver muy bien las fotos por lo cual no puedo describirlas. ¿Podrías volver a pasarlas o cambiar de fotos?";
        }
    }
}
