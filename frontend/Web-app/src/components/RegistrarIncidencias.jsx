import { useRef, useState, lazy, Suspense } from 'react'
import {
  describirFotosConIA,
  esErrorTecnicoIA,
  subirFotosACloudinary,
  registrarIncidencia,
  obtenerPuntosUsuario
} from '../services/incidenciasApi'
import { useAuth } from '../hooks/useAuth'
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
const MAX_CARACTERES = 800
const PUNTOS_POR_INCIDENCIA = 10

const INSIGNIAS_LOCALES = [
  { nombre: 'Primer reporte', recompensa: 'Bono de S/20 en tu billetera digital para canjear en mercados locales.', requisito: 1 },
  { nombre: 'Reportero activo', recompensa: 'Bono de S/50 en tu billetera digital + recarga de 10 GB móviles.', requisito: 5 },
  { nombre: 'Guardián del barrio', recompensa: 'Vale de S/100 en canasta familiar + reconocimiento público en redes sociales.', requisito: 10 },
  { nombre: 'EcoHéroe', recompensa: 'Vale de S/200 en canasta familiar + kit de productos ecológicos para el hogar.', requisito: 15 },
  { nombre: 'Embajador EcoSólido', recompensa: 'Vale de S/500 en canasta familiar + kit EcoSólido + certificado de Embajador Ambiental.', requisito: 20 },
]

function evaluarInsigniasLocales(totalIncidencias, insigniasYaDesbloqueadas = []) {
  const nombresDesbloqueados = new Set(insigniasYaDesbloqueadas.map(i => i.nombre))
  return INSIGNIAS_LOCALES.filter(
    ins => totalIncidencias >= ins.requisito && !nombresDesbloqueados.has(ins.nombre)
  )
}

function calcularDistancia(lat1, lon1, lat2, lon2) {
  const R = 6371e3; // Radio de la Tierra en metros
  const phi1 = lat1 * Math.PI / 180;
  const phi2 = lat2 * Math.PI / 180;
  const deltaPhi = (lat2 - lat1) * Math.PI / 180;
  const deltaLambda = (lon2 - lon1) * Math.PI / 180;

  const a = Math.sin(deltaPhi / 2) * Math.sin(deltaPhi / 2) +
            Math.cos(phi1) * Math.cos(phi2) *
            Math.sin(deltaLambda / 2) * Math.sin(deltaLambda / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));

  return R * c;
}

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
  const [ubicacion, setUbicacion] = useState(null);
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
  const [puntosGanados, setPuntosGanados] = useState(0)
  const [nuevasInsignias, setNuevasInsignias] = useState([])
  const { updatePuntos } = useAuth()
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
      const fotosExistentes = prev.filter(s => s.file);
      const espacioDisponible = MAX_FOTOS - fotosExistentes.length;
      if (nuevosSlots.length > espacioDisponible) {
        nuevosSlots.slice(espacioDisponible).forEach((slot) => {
          URL.revokeObjectURL(slot.preview);
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
          const MAX_WIDTH = 1200;
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
          }, 'image/jpeg', 0.7);
        };
      };
    });
  };

  // Verifica si la incidencia ya existe (duplicada) en el almacenamiento local
  // Lógica espejo del backend: misma categoria + descripcion + latitud + longitud en radio de 50m
  function esIncidenciaDuplicadaLocal(incidenciasLocales) {
    return incidenciasLocales.some(inc =>
      inc.categoria === categoria &&
      inc.descripcion === descripcion &&
      calcularDistancia(inc.latitud, inc.longitud, ubicacion.lat, ubicacion.lng) <= 50
    )
  }

  // Registra la incidencia localmente (modo offline sin backend)
  function registrarIncidenciaLocal() {
    const incidenciasLocales = JSON.parse(localStorage.getItem('incidenciasLocales') || '[]')

    // HU011: Validar incidencia duplicada (no asigna puntos)
    if (esIncidenciaDuplicadaLocal(incidenciasLocales)) {
      setWarningMessage('Esta incidencia ya fue registrada anteriormente. No se asignarán puntos adicionales.')
      setShowWarningModal(true)
      return
    }

    const nuevaIncidenciaLocal = {
      id: `INC-${Date.now().toString().slice(-6)}`,
      categoria: categoria,
      fecha: new Date().toISOString().split('T')[0],
      estado: 'Pendiente',
      descripcion: descripcion,
      direccionTexto: ubicacion.address,
      latitud: ubicacion.lat,
      longitud: ubicacion.lng
    }
    incidenciasLocales.push(nuevaIncidenciaLocal)
    localStorage.setItem('incidenciasLocales', JSON.stringify(incidenciasLocales))

    // HU011: Asignar puntos al usuario (solo si no es duplicada)
    const puntosActuales = parseInt(localStorage.getItem('puntos') || '0', 10)
    const nuevosPuntos = puntosActuales + PUNTOS_POR_INCIDENCIA
    updatePuntos(nuevosPuntos)
    setPuntosGanados(PUNTOS_POR_INCIDENCIA)

    // Evaluar insignias localmente
    const insigniasDesbloqueadas = JSON.parse(localStorage.getItem('insigniasDesbloqueadas') || '[]')
    const nuevasInsigniasLocales = evaluarInsigniasLocales(incidenciasLocales.length, insigniasDesbloqueadas)
    if (nuevasInsigniasLocales.length > 0) {
      const todasInsignias = [...insigniasDesbloqueadas, ...nuevasInsigniasLocales]
      localStorage.setItem('insigniasDesbloqueadas', JSON.stringify(todasInsignias))
      setNuevasInsignias(nuevasInsigniasLocales)
    } else {
      setNuevasInsignias([])
    }

    if (onIncidenciaRegistrada) {
      onIncidenciaRegistrada(nuevaIncidenciaLocal)
    }

    setShowSuccessModal(true)
  }

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
      const respuesta = await registrarIncidencia(
        categoria,
        descripcion,
        urlsCloudinary,
        fotosComprimidas,
        ubicacion.address,
        ubicacion.lat,
        ubicacion.lng
      )

      if (respuesta.puntosGanados) {
        setPuntosGanados(respuesta.puntosGanados)
        const puntosGuardados = parseInt(localStorage.getItem('puntos') || '0', 10)
        updatePuntos(puntosGuardados + PUNTOS_POR_INCIDENCIA)
      }

      if (respuesta.nuevasInsignias && respuesta.nuevasInsignias.length > 0) {
        setNuevasInsignias(respuesta.nuevasInsignias)
      } else {
        setNuevasInsignias([])
      }

      const nuevaIncidencia = {
        id: `INC-${Date.now().toString().slice(-6)}`,
        categoria: categoria,
        fecha: new Date().toISOString().split('T')[0],
        estado: 'Pendiente',
        descripcion: descripcion,
        direccionTexto: ubicacion.address,
        latitud: ubicacion.lat,
        longitud: ubicacion.lng
      }

      if (onIncidenciaRegistrada) {
        onIncidenciaRegistrada(nuevaIncidencia)
      }

      setShowSuccessModal(true)
    } catch (err) {
      const esErrorConexion = err.message && (
        err.message.includes('Failed to fetch') ||
        err.message.includes('No se pudo conectar con el backend') ||
        err.message.includes('NetworkError') ||
        err.message.includes('Load failed')
      )

      if (esErrorConexion) {
        registrarIncidenciaLocal()
      } else {
        setWarningMessage(err.message ?? 'Error al registrar la incidencia.');
        setShowWarningModal(true);
      }
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
      const urls = await subirFotosACloudinary(fotosSubidas.map((slot) => slot.file))
      setUrlsCloudinary(urls)

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
    handleFotoChange(0, { target: { files: archivos } });
  };

  return (
    <main className="registrar" style={{ '--font-scale': tamañoLetra }}>
      <h2 className="registrar__title">Registrar Incidencias</h2>
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
          <button type="button"  onClick={() => setTamañoLetra(t => Math.min(1.7, t + 0.1))}>🗚+</button>
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
              {browserSupportsSpeechRecognition && (
                <div className="registrar__voz">
                  <button
                    type="button"
                    className={`registrar__btn--voz ${listening ? 'registrar__btn--voz--activo' : ''}`}
                    onClick={() => {
                      if (listening) {
                        SpeechRecognition.stopListening();
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
            <SuccessModal onClose={handleCloseSuccessModal} puntosGanados={puntosGanados} nuevasInsignias={nuevasInsignias} />
          </Suspense>
        )}
        {showWarningModal && (
          <Suspense fallback={<div className="modal-loading">Cargando...</div>}>
            <WarningModal
              message={warningMessage}
              title={warningMessage === 'Esta incidencia ya fue registrada anteriormente. No se asignarán puntos adicionales.' ? 'Incidencia duplicada' : undefined}
              hidePrefix={warningMessage === 'Esta incidencia ya fue registrada anteriormente. No se asignarán puntos adicionales.'}
              onClose={() => setShowWarningModal(false)}
            />
          </Suspense>
        )}
        {showHelpModal && <HelpModal onClose={() => setShowHelpModal(false)} fontScale={tamañoLetra} />}
      </div>
    </main>
  )
}
