# Configuración de la Integración con IA (HuggingFace)

## Problema resuelto
Se corrigió el error "No se pudo conectar con la IA: Ocurrió un error inesperado" que aparecía al usar el botón "Generar descripción con IA".

## Cambios realizados

### 1. Frontend (`frontend/Web-app/src/services/incidenciasApi.js`)
- ✅ Corregida la URL: ahora llama a `/incidencias/generar-descripcion` en lugar de `/api/incidencias/describir-fotos`
- ✅ Mejorado el manejo de errores para mostrar mensajes más descriptivos
- ✅ El body de la petición ahora envía `urlFoto` en lugar de `imagenes`

### 2. Backend (`Backend/EcoSolido/src/main/java/com/DisenoProductos/EcoSolido/Middleware/GlobalExceptionHandler.java`)
- ✅ Mejorado el manejo de excepciones para propagar el mensaje de error real
- ✅ Agregado manejo específico para `IllegalStateException`
- ✅ Los errores ahora devuelven JSON con el mensaje detallado

### 3. Archivos de configuración
- ✅ Creado `.env` para el frontend
- ✅ Creado `.env.example` como referencia

## 🚀 Cómo configurar y usar la IA

### Paso 1: Obtener token de HuggingFace
1. Ve a https://huggingface.co/settings/tokens
2. Inicia sesión o crea una cuenta
3. Crea un nuevo token con permisos de lectura
4. Copia el token generado

### Paso 2: Configurar el token en el backend (Windows PowerShell)

**IMPORTANTE:** Debes establecer la variable de entorno ANTES de iniciar el backend.

```powershell
# Establece tu token (reemplaza TU_TOKEN con el token real)
$env:HF_TOKEN="hf_xxxxxxxxxxxxxxxxxxxxxxxxxxxxxx"

# Luego inicia el backend
cd Backend/EcoSolido
.\mvnw.cmd spring-boot:run
```

### Paso 3: Verificar que el backend esté corriendo
El backend debe estar ejecutándose en `http://localhost:8081`

### Paso 4: Iniciar el frontend
```bash
cd frontend/Web-app
npm run dev
```

### Paso 5: Probar la funcionalidad
1. Abre la aplicación web en tu navegador
2. Sube una foto en el formulario de registro
3. Haz clic en "Generar descripción con IA"
4. Confirma en el modal
5. Espera a que se genere la descripción

## 🔍 Solución de problemas

### Error: "HF_TOKEN no está configurado"
**Causa:** La variable de entorno no se estableció antes de iniciar el backend.
**Solución:** Detén el backend, establece la variable y reinicia.

### Error: "No se pudo conectar con el backend"
**Causa:** El backend no está corriendo en el puerto 8081.
**Solución:** Inicia el backend con `.\mvnw.cmd spring-boot:run`

### Error: "Error de Hugging Face (401)"
**Causa:** Token inválido o expirado.
**Solución:** Verifica que el token sea correcto y tenga permisos.

### Error: "Error de Hugging Face (429)"
**Causa:** Límite de tasa de la API alcanzado.
**Solución:** Espera unos minutos antes de intentar nuevamente.

### Error: "Error de Hugging Face (500)"
**Causa:** Problema temporal con el servicio de HuggingFace.
**Solución:** Intenta nuevamente más tarde.

## 📝 Notas importantes

1. **El token debe mantenerse secreto:** Nunca compartas tu token de HuggingFace
2. **Variables de entorno:** En Windows, las variables establecidas con `$env:` solo persisten en la sesión actual de PowerShell
3. **Reiniciar el backend:** Cada vez que reinicies el backend, debes volver a establecer `HF_TOKEN`
4. **Modelo utilizado:** Se usa `meta-llama/Llama-3.2-11B-Vision-Instruct` que requiere acceso aprobado en HuggingFace

## 🔗 Enlaces útiles

- [HuggingFace Tokens](https://huggingface.co/settings/tokens)
- [Llama-3.2-11B-Vision-Instruct](https://huggingface.co/meta-llama/Llama-3.2-11B-Vision-Instruct)
- [Documentación de HuggingFace Inference API](https://huggingface.co/docs/api-inference/index)