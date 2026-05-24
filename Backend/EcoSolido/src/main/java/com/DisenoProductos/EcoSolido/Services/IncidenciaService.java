package com.DisenoProductos.EcoSolido.Services;

import com.DisenoProductos.EcoSolido.Integrations.CloudinaryIntegration;
import com.DisenoProductos.EcoSolido.Integrations.HuggingFaceIntegration;
import com.DisenoProductos.EcoSolido.Models.DTOs.IncidenciaRequestDTO;
import com.DisenoProductos.EcoSolido.Models.Entities.IncidenciaEntity;
import com.DisenoProductos.EcoSolido.Models.Entities.IncidenciaFotoEntity;
import com.DisenoProductos.EcoSolido.Models.States.IncidenciaEstados;
import com.DisenoProductos.EcoSolido.Repositories.IncidenciaRepository;
import java.io.IOException;
import java.util.Map;

import com.DisenoProductos.EcoSolido.Services.HuggingFaceException;
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
    public String generarDescripcion(List<String> urlFotos){
        try{
            return huggingFaceIntegration.describirFotos(urlFotos);
        } catch(Exception e){
                throw new HuggingFaceException("No se pudo describir la foto.",e);
        }
    }
}
