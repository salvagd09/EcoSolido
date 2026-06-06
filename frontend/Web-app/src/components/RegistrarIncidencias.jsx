import { useRef, useState } from 'react'
import {
  describirFotosConIA,
  esErrorTecnicoIA,
  subirFotosACloudinary,
  registrarIncidencia
} from '../services/incidenciasApi'
import { esRespuestaFotosNoVisibles, MENSAJE_FOTOS_NO_VISIBLES } from '../utils/iaDescripcion'
import AIConfirmModal from './AIConfirmModal'
import { IconIA, IconNube } from './icons'
import SuccessModal from './SuccessModal'
import WarningModal from './WarningModal'
import './RegistrarIncidencias.css'

const CATEGORIAS = [
  'Acumulación y falta de recojo',
  'Basura en vía pública',
  'Contenedor dañado o lleno',
  'Escombros o materiales de construcción',
  'Residuos en parques o áreas verdes',
  'Otro',
]

const MAX_FOTOS = 5
const MAX_TAMANO_MB = 10 // Tamaño máximo por foto en MB
const MAX_CARACTERES = 800 // Límite de caracteres para la descripción

function crearSlotsVacios() {
  return Array.from({ length: MAX_FOTOS }, () => ({ preview: null, file: null }))
}

export default function RegistrarIncidencias() {
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
  const [errorTecnico, setErrorTecnico] = useState('')
  const [isDragging, setIsDragging] = useState(false);


  const fileInputRefs = useRef([])
  const fotosSubidas = fotos.filter((f) => f.file)
  const tieneFotos = fotosSubidas.length > 0
  const modalAbierto = showSuccessModal || showAIModal || showWarningModal

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
      prev.forEach((slot) => {
        if (slot.preview) URL.revokeObjectURL(slot.preview)
      })
      // Limitar al máximo permitido
      return [...prev.filter(s => s.file), ...nuevosSlots].slice(0, MAX_FOTOS)
    })

    if (descripcionEsErrorIA) {
      setDescripcion('')
      limpiarEstadoErrorIA()
    }
    setErrorTecnico('')
    event.target.value = ''
  }
  function handleEliminarFoto(index) {
    setFotos((prev) => {
      if (prev[index].preview) URL.revokeObjectURL(prev[index].preview)
      return prev.filter((_, i) => i !== index)
    })
    if (descripcionEsErrorIA) {
      setDescripcion('')
      limpiarEstadoErrorIA()
    }
    setErrorTecnico('')
  }
  function handleDescripcionChange(event) {
    const nuevoValor = event.target.value
    setDescripcion(nuevoValor)
    setCaracteresRestantes(MAX_CARACTERES - nuevoValor.length)
    if (descripcionEsErrorIA) limpiarEstadoErrorIA()
  }

  async function handleSubmit(event) {
    event.preventDefault()
    if (descripcionEsErrorIA) {
      alert('Genera una descripción válida o cambia las fotos antes de registrar.')
      return
    }
    if (!categoria) {
      setWarningMessage('No ha establecido alguna categoría.')
      setShowWarningModal(true)
      return
    }
    if (!tieneFotos) {
      setWarningMessage('No ha colocado foto alguna.')
      setShowWarningModal(true)
      return
    }
    if (!descripcion.trim()) {
      setWarningMessage('No ha escrito alguna descripción de la incidencia.')
      setShowWarningModal(true)
      return
    }
    try {
      await registrarIncidencia(
        categoria,
        descripcion,
        urlsCloudinary,                          // URLs si usó IA
        fotosSubidas.map((slot) => slot.file)
      )
      setShowSuccessModal(true)
    } catch (err) {
      setWarningMessage(err.message ?? 'Error al registrar la incidencia.')
      setShowWarningModal(true)
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
    <main className="registrar">
      <h2 className="registrar__title">Registrar Incidencias</h2>

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
                className="foto-slot__btn"
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
              Solo se pueden ingresar hasta 5 fotos con un tamaño total que no debe superar los 20 MB entre todas
            </p>
          </fieldset>

          <div className="registrar__field">
            <label htmlFor="categoria">Selecciona una categoría <span style={{ color: '#ff7a00' }}>*</span>:</label>
            <div className="registrar__select-wrap">
              <select
                id="categoria"
                value={categoria}
                onChange={(e) => setCategoria(e.target.value)}
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
            <label htmlFor="descripcion">Descripción sobre la incidencia:</label>
            <div className="registrar__textarea-wrapper">
              <textarea
                id="descripcion"
                rows={7}
                value={descripcion}
                onChange={handleDescripcionChange}
                placeholder="Ingrese su texto o genérelo con IA a partir de las fotos"
                disabled={generandoIA}
                className={descripcionEsErrorIA ? 'registrar__textarea--ia-error' : ''}
                aria-invalid={descripcionEsErrorIA}
              />
              <span className={`registrar__contador ${caracteresRestantes < 50 ? 'registrar__contador--alerta' : ''}`}>
                {caracteresRestantes} caracteres restantes
              </span>
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

        {showSuccessModal && <SuccessModal onClose={handleCloseSuccessModal} />}

        {showWarningModal && (
          <WarningModal
            onClose={() => setShowWarningModal(false)}
            message={warningMessage}
          />
        )}
      </div>
    </main>
  )
}
