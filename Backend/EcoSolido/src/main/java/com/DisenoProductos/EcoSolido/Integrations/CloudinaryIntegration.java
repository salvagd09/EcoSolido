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
    public Map subir(MultipartFile archivo) throws IOException {
        return cloudinary.uploader().upload(
                // Mejora de código eficiente: Modifica la URL para
                // forzar formatos livianos (WebP/AVIF) y compresión inteligente (q_auto)
                // de modo que el ciudadano gaste menos datos móviles al navegar y cargar la app.
                archivo.getBytes(),
                ObjectUtils.asMap(
                        "folder", "incidencias",
                        "fetch_format", "auto",    // ← Fuerza formatos livianos (WebP/AVIF)
                        "quality", "auto"          // ← Compresión inteligente (q_auto)
                )
        );
    }
    public Map eliminar(String publicId) throws IOException{
        return cloudinary.uploader().destroy(publicId,ObjectUtils.emptyMap());
    }
}
