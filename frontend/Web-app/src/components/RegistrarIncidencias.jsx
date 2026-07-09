import { useRef, useState, lazy, Suspense } from 'react'
import {
  describirFotosConIA,
  esErrorTecnicoIA,
  subirFotosACloudinary,
  registrarIncidencia
} from '../services/incidenciasApi'
import { esRespuestaFotosNoVisibles, MENSAJE_FOTOS_NO_VISIBLES } from '../utils/iaDescripcion'
import AIConfirmModal from './AIConfirmModal'
import { IconIA, IconNube } from './icons'
import './RegistrarIncidencias.css';
import LocationPicker from './LocationPicker';
import HelpModal from './HelpModal'
import SpeechRecognition, { useSpeechRecognition } from 'react-speech-recognition'
const CATEGORIAS = [
  'Acumulación y falta de recojo',
  'Basura en vía pública',
  'Contenedor dañado o lleno',
  'Escombros o materiales de construcción',
  'Residuos en parques o áreas verdes',
  'Otro',
]
const SuccessModal = lazy(() => import('./SuccessModal'));
const WarningModal = lazy(() => import('./WarningModal'));
const MAX_FOTOS = 5
const MAX_CARACTERES = 800 // Límite de caracteres para la descripción

function crearSlotsVacios() {
  return Array.from({ length: MAX_FOTOS }, () => ({ preview: null, file: null }))
}

export default function RegistrarIncidencias({ onIncidenciaRegistrada }) {
  const [fotos, setFotos] = useState(crearSlotsVacios)
  const [categoria, setCategoria] = useState('')
  const [descripcion, setDescripcion] = useState('')
  const [caracteresRestantes, setCaracteresRestantes] = useState(MAX_CARACTERES)
  const [descripcionEsErrorIA, setDescripcionEsErrorIA] = useState(false)
  const [showSuccessModal, setShowSuccessModal] = useState(false)
  const [showAIModal, setShowAIModal] = useState(false)
  const [showWarningModal, setShowWarningModal] = useState(false)
  const [warningMessage, setWarningMessage] = useState('')
  const [generandoIA, setGenerandoIA] = useState(false)
  const [urlsCloudinary, setUrlsCloudinary] = useState([])
  const [errorTecnico, setErrorTecnico] = useState('');
  const [leafletKey, setLeafletKey] = useState(0)
  const [ubicacion, setUbicacion] = useState(null); // {lat,lng,address}
  const [isDragging, setIsDragging] = useState(false);
  const [camposError, setCamposError] = useState({
    categoria: false,
    fotos: false,
    descripcion: false,
    ubicacion: false
  })

  const fileInputRefs = useRef([])
  const fotosSubidas = fotos.filter((f) => f.file)
  const tieneFotos = fotosSubidas.length > 0
  const modalAbierto = showSuccessModal || showAIModal || showWarningModal
  const [showHelpModal, setShowHelpModal] = useState(false)
  const [tamañoLetra, setTamañoLetra] = useState(1)
  const { transcript, listening, resetTranscript, browserSupportsSpeechRecognition } = useSpeechRecognition()
  function mostrarMensajeFotosNoVisibles() {
    setDescripcion(MENSAJE_FOTOS_NO_VISIBLES)
    setDescripcionEsErrorIA(true)
  }

  function limpiarEstadoErrorIA() {
    setDescripcionEsErrorIA(false)
  }

  function handleFotoChange(index, event) {
    const files = Array.from(event.target.files ?? [])
    if (!files.length) return

    const nuevosSlots = files.map((file) => ({
      preview: URL.createObjectURL(file),
      file
    }))

    setFotos((prev) => {
      // Liberar previews anteriores
      const fotosExistentes = prev.filter(s => s.file);
      const espacioDisponible = MAX_FOTOS - fotosExistentes.length;
      if (nuevosSlots.length > espacioDisponible) {
        nuevosSlots.slice(espacioDisponible).forEach((slot) => {
          URL.revokeObjectURL(slot.preview); // Libera solo las sobrantes inmediatamente
        });
      }
      return [...fotosExistentes, ...nuevosSlots].slice(0, MAX_FOTOS);
    })

    if (descripcionEsErrorIA) {
      setDescripcion('')
      limpiarEstadoErrorIA()
    }
    setCamposError(prev => ({ ...prev, fotos: false }))
    setErrorTecnico('')
    event.target.value = ''
  }
  function handleEliminarFoto(index) {
    setFotos((prev) => {
      // Revocar únicamente la URL del elemento que se está eliminando
      if (prev[index].preview) {
        URL.revokeObjectURL(prev[index].preview);
      }
      return prev.filter((_, i) => i !== index);
    });
  }
  function handleDescripcionChange(event) {
    const nuevoValor = event.target.value;
    setDescripcion(nuevoValor);
    setCaracteresRestantes(MAX_CARACTERES - nuevoValor.length);
    setCamposError(prev => ({ ...prev, descripcion: false }));
    if (descripcionEsErrorIA) limpiarEstadoErrorIA();
  }
  const comprimirImagen = (file) => {
    return new Promise((resolve) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = (event) => {
        const img = new Image();
        img.src = event.target.result;
        img.onload = () => {
          const canvas = document.createElement('canvas');
          const MAX_WIDTH = 1200; // Resolución suficiente para verificar residuos
          const MAX_HEIGHT = 1200;
          let width = img.width;
          let height = img.height;
          if (width > height) {
            if (width > MAX_WIDTH) {
              height *= MAX_WIDTH / width;
              width = MAX_WIDTH;
            }
          } else {
            if (height > MAX_HEIGHT) {
              width *= MAX_HEIGHT / height;
              height = MAX_HEIGHT;
            }
          }
          canvas.width = width;
          canvas.height = height;
          const ctx = canvas.getContext('2d');
          ctx.drawImage(img, 0, 0, width, height);

          canvas.toBlob((blob) => {
            resolve(new File([blob], file.name, {
              type: 'image/jpeg',
              lastModified: Date.now()
            }));
          }, 'image/jpeg', 0.7); // 70% de calidad JPEG (óptima compresión/peso)
        };
      };
    });
  };
  async function handleSubmit(event) {
    event.preventDefault();
    const errores = {
      categoria: !categoria,
      fotos: !tieneFotos,
      descripcion: !descripcion.trim(),
      ubicacion: !ubicacion
    };
    setCamposError(errores);
    if (descripcionEsErrorIA) {
      alert('Genera una descripción válida o cambia las fotos antes de registrar.');
      return;
    }
    if (!categoria) { setWarningMessage('No ha establecido alguna categoría.'); setShowWarningModal(true); return; }
    if (!tieneFotos) { setWarningMessage('No ha colocado foto alguna.'); setShowWarningModal(true); return; }
    if (!descripcion.trim()) { setWarningMessage('No ha escrito alguna descripción de la incidencia.'); setShowWarningModal(true); return; }
    if (!ubicacion) { setWarningMessage('Debe seleccionar y confirmar una ubicación antes de registrar.'); setShowWarningModal(true); return; }
    try {
      const fotosComprimidas = await Promise.all(
        fotosSubidas.map(slot => comprimirImagen(slot.file))
      );
      await registrarIncidencia(
        categoria,
        descripcion,
        urlsCloudinary,                          // URLs si usó IA
        fotosComprimidas,
        ubicacion.address,
        ubicacion.lat,
        ubicacion.lng
      )
      // Crear nueva incidencia para actualizar métricas
      const nuevaIncidencia = {
        id: `INC-${Date.now().toString().slice(-6)}`,
        categoria: categoria,
        fecha: new Date().toISOString().split('T')[0],
        estado: 'Pendiente', // Todas las nuevas incidencias comienzan como Pendientes
        descripcion: descripcion,
        direccionTexto: ubicacion.address,
        latitud: ubicacion.lat,
        longitud: ubicacion.lng
      }

      // Notificar al componente padre para actualizar métricas
      if (onIncidenciaRegistrada) {
        onIncidenciaRegistrada(nuevaIncidencia)
      }

      setShowSuccessModal(true)
    } catch (err) {
      setWarningMessage(err.message ?? 'Error al registrar la incidencia.');
      setShowWarningModal(true);
    }
  }
  function handleGenerarIA() {
    if (!tieneFotos) {
      alert('Debes subir al menos una foto antes de generar la descripción con IA.')
      return
    }
    setErrorTecnico('')
    setShowAIModal(true)
  }

  async function handleConfirmarIA() {
    setShowAIModal(false)
    setGenerandoIA(true)
    limpiarEstadoErrorIA()
    setErrorTecnico('')

    try {
      // Subir fotos a Cloudinary y obtener URLs
      const urls = await subirFotosACloudinary(fotosSubidas.map((slot) => slot.file))
      setUrlsCloudinary(urls)

      // Enviar URLs a la IA
      const texto = (await describirFotosConIA(urls)).trim()

      if (esRespuestaFotosNoVisibles(texto)) {
        mostrarMensajeFotosNoVisibles()
      } else {
        setDescripcion(texto)
      }
    } catch (err) {
      const mensaje = err instanceof Error ? err.message : 'Error desconocido con la IA.'
      if (esErrorTecnicoIA(mensaje)) {
        setErrorTecnico(mensaje)
        setDescripcion('')
        limpiarEstadoErrorIA()
      } else {
        mostrarMensajeFotosNoVisibles()
      }
    } finally {
      setGenerandoIA(false)
    }
  }

  function resetFormulario() {
    fotos.forEach((slot) => {
      if (slot.preview) URL.revokeObjectURL(slot.preview)
    })
    setFotos(crearSlotsVacios())
    setCategoria('')
    setDescripcion('')
    limpiarEstadoErrorIA()
    setErrorTecnico('')
    setUrlsCloudinary([])
    setUbicacion(null)
    setLeafletKey(prevKey => prevKey + 1)
    fileInputRefs.current = []
  }

  function handleCloseSuccessModal() {
    setShowSuccessModal(false)
    resetFormulario()
  }
  const handleDrop = (e) => {
    e.preventDefault();
    setIsDragging(false);
    const archivos = Array.from(e.dataTransfer.files)
      .filter(file => file.type.startsWith("image/"));
    if (!archivos.length) return;
    // Simula el evento que ya espera handleFotoChange
    handleFotoChange(0, { target: { files: archivos } });
  };
  return (
    <main className="registrar" style={{ '--font-scale': tamañoLetra }}>
      <h2 className="registrar__title">Registrar Incidencias</h2>
      {/*Nuevo botón*/}
      <div className="registrar__controles-texto">
        <button
          type="button"
          className="registrar__help-btn"
          onClick={() => setShowHelpModal(true)}
        >
          ¿Cómo funciona?
        </button>
        <div className="registrar__font-controls">
          <button type="button"  onClick={() => setTamañoLetra(t => Math.max(0.8, t - 0.1))}>🗛-</button>
          <button type="button"  onClick={() => setTamañoLetra(1)}>A</button>
          <button type="button"  onClick={() => setTamañoLetra(t => Math.min(1.5, t + 0.1))}>🗚+</button>
        </div>
      </div>

      <div className={`registrar__wrapper${modalAbierto ? ' registrar__wrapper--modal-open' : ''}`}>
        <form className="registrar__form" onSubmit={handleSubmit}>
          <fieldset className={`registrar__fotos ${isDragging ? "dragging" : ""}`}
            onDragOver={(e) => { e.preventDefault(); setIsDragging(true); }}
            onDragLeave={() => setIsDragging(false)}
            onDrop={handleDrop}>
            <legend>Fotos a presentar: <span style={{ color: '#ff7a00' }}>*</span></legend>
            <div className="registrar__fotos-container">
              <input
                ref={(el) => { fileInputRefs.current[0] = el }}
                type="file"
                accept="image/*"
                multiple
                className="foto-slot__input"
                onChange={(e) => handleFotoChange(0, e)}
                aria-label="Subir fotos"
              />
              <button
                type="button"
                className={`foto-slot__btn ${camposError.fotos ? "campo-error" : ""}`}
                onClick={() => fileInputRefs.current[0]?.click()}
              >
                <div className="foto-slot__upload-area">
                  <IconNube />
                  <span className="foto-slot__upload-text">
                    {fotosSubidas.length > 0
                      ? `${fotosSubidas.length} foto(s) seleccionada(s)`
                      : 'Ingresa o arrastre una o más fotos'}
                  </span>
                </div>
              </button>

              {/* Previsualización de todas las fotos */}
              <div className="registrar__fotos-preview">
                {fotosSubidas.map((slot, index) => (
                  <div key={index} className="foto-slot">
                    <img src={slot.preview} alt={`Foto ${index + 1}`} className="foto-slot__preview" />
                    <button
                      type="button"
                      className="foto-slot__remove"
                      onClick={() => handleEliminarFoto(index)}
                      aria-label={`Quitar foto ${index + 1}`}
                    >
                      ×
                    </button>
                  </div>
                ))}
              </div>
            </div>
            <p className="registrar__fotos-info">
              Solo se pueden ingresar hasta 5 fotos con un tamaño total que no debe superar los 50 MB entre todas
            </p>
          </fieldset>

          <div className="registrar__field">
            <label htmlFor="categoria">Selecciona una categoría(6 categorías) <span style={{ color: '#ff7a00' }}>*</span>:</label>
            <div className="registrar__select-wrap" >
              <select
                id="categoria"
                className={`${camposError.categoria ? "campo-error" : ""}`}
                value={categoria}
                onChange={(e) => {
                  setCategoria(e.target.value)
                  setCamposError(prev => ({ ...prev, categoria: false }))
                }}
              >
                <option value="" disabled>
                  Seleccione una opción
                </option>
                {CATEGORIAS.map((cat) => (
                  <option key={cat} value={cat}>
                    {cat}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div className="registrar__field registrar__field--descripcion">
            <label htmlFor="descripcion">Descripción sobre la incidencia: <span style={{ color: '#ff7a00' }}>*</span></label>
            <div className="registrar__textarea-wrapper">
              <textarea
                id="descripcion"
                rows={7}
                value={listening ? transcript : descripcion}
                onChange={handleDescripcionChange}
                placeholder="Ingrese su texto o genérelo con IA a partir de las fotos"
                disabled={generandoIA}
                className={`${descripcionEsErrorIA ? 'registrar__textarea--ia-error' : ''}${camposError.descripcion ? 'campo-error' : ''}`}
                aria-invalid={descripcionEsErrorIA}
                maxLength={MAX_CARACTERES}
              />
              <span className={`registrar__contador ${caracteresRestantes < 50 ? 'registrar__contador--alerta' : ''}`}>
                {caracteresRestantes} caracteres restantes
              </span>
              {/* Botón de voz */}
              {browserSupportsSpeechRecognition && (
                <div className="registrar__voz">
                  <button
                    type="button"
                    className={`registrar__btn--voz ${listening ? 'registrar__btn--voz--activo' : ''}`}
                    onClick={() => {
                      if (listening) {
                        // 1. Se apaga el micrófono
                        SpeechRecognition.stopListening();
                        // Permite guardar el texto al final
                        if (transcript) {
                          setDescripcion(transcript);
                          setCaracteresRestantes(MAX_CARACTERES - transcript.length);
                        }
                      } else {
                        resetTranscript();
                        SpeechRecognition.startListening({ language: 'es-PE', continuous: true });
                      }
                    }}
                  >
                    {listening ? '⏹️ Detener grabación' : '🗣️ Dictar descripción'}
                  </button>
                  {listening && (
                    <span className="registrar__voz-estado">Escuchando...</span>
                  )}
                </div>
              )}
            </div>
            <span style={{ color: '#ff7a00' }}>*Campo Obligatorio</span>
            {generandoIA && (
              <span className="registrar__ia-loading" role="status">
                Analizando las fotos con IA...
              </span>
            )}
            {errorTecnico && (
              <div className="registrar__ia-tecnico" role="alert">
                <strong>No se pudo conectar con la IA:</strong>
                <p>{errorTecnico}</p>
                <p className="registrar__ia-tecnico-hint">
                  Verifica que el backend esté ejecutándose y que la API Key de Google Vision esté configurada correctamente.
                </p>
              </div>
            )}
          </div>
          {/* Location Picker inserted below description */}
          <div className="registrar__field">
            <LocationPicker
              key={leafletKey}
              value={ubicacion}
              onConfirm={setUbicacion}
              fontScale={tamañoLetra} />
          </div>
          <div className="registrar__actions">
            <button type="submit" className="registrar__btn registrar__btn--primary">
              Registrar incidencia
            </button>
            <button
              type="button"
              className="registrar__btn registrar__btn--ia"
              onClick={handleGenerarIA}
              disabled={generandoIA}
            >
              <IconIA />
              Generar descripción con IA
            </button>
          </div>
        </form>

        {showAIModal && (
          <AIConfirmModal
            onConfirm={handleConfirmarIA}
            onCancel={() => setShowAIModal(false)}
          />
        )}

        {showSuccessModal && (
          <Suspense fallback={<div>Cargando...</div>}>
            <SuccessModal onClose={handleCloseSuccessModal} />
          </Suspense>
        )}
        {showWarningModal && (
          <Suspense fallback={<div className="modal-loading">Cargando...</div>}>
            <WarningModal
              message={warningMessage}
              onClose={() => setShowWarningModal(false)}
            />
          </Suspense>
        )}
        {/*Nuevo modal */}
        {showHelpModal && <HelpModal onClose={() => setShowHelpModal(false)} fontScale={tamañoLetra} />}
      </div>
    </main>
  )
}