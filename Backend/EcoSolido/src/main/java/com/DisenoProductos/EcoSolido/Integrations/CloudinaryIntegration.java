package com.DisenoProductos.EcoSolido.Integrations;
import com.cloudinary.Cloudinary;
import com.cloudinary.utils.ObjectUtils;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;
import java.io.IOException;
import java.util.Map;

@Service
public class CloudinaryIntegration {
    private final Cloudinary cloudinary;
    public CloudinaryIntegration(@Value("${cloudinary.url}") String cloudinaryURL) {
        this.cloudinary =new Cloudinary(cloudinaryURL);
    }
    public Map subir(MultipartFile archivo) throws IOException{
        return cloudinary.uploader().upload(archivo.getBytes(),ObjectUtils.asMap("folder","incidencias"));
    }
    public Map eliminar(String publicId) throws IOException{
        return cloudinary.uploader().destroy(publicId,ObjectUtils.emptyMap());
    }
}
