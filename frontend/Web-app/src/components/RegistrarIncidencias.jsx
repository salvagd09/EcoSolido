import { useRef, useState } from 'react'
import {
  describirFotosConIA,
  esErrorTecnicoIA,
  prepararImagenesParaIA,
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

const SLOTS_FOTOS = 1

function crearSlotsVacios() {
  return Array.from({ length: SLOTS_FOTOS }, () => ({ preview: null, file: null }))
}

export default function RegistrarIncidencias() {
  const [fotos, setFotos] = useState(crearSlotsVacios)
  const [categoria, setCategoria] = useState('')
  const [descripcion, setDescripcion] = useState('')
  const [descripcionEsErrorIA, setDescripcionEsErrorIA] = useState(false)
  const [showSuccessModal, setShowSuccessModal] = useState(false)
  const [showAIModal, setShowAIModal] = useState(false)
  const [showWarningModal, setShowWarningModal] = useState(false)
  const [warningMessage, setWarningMessage] = useState('')
  const [generandoIA, setGenerandoIA] = useState(false)
  const [errorTecnico, setErrorTecnico] = useState('')
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
    const file = event.target.files?.[0]
    if (!file) return

    const preview = URL.createObjectURL(file)
    setFotos((prev) => {
      if (prev[index].preview) URL.revokeObjectURL(prev[index].preview)
      const next = [...prev]
      next[index] = { preview, file }
      return next
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
      const next = [...prev]
      next[index] = { preview: null, file: null }
      return next
    })
    if (descripcionEsErrorIA) {
      setDescripcion('')
      limpiarEstadoErrorIA()
    }
    setErrorTecnico('')
  }

  function handleDescripcionChange(event) {
    setDescripcion(event.target.value)
    if (descripcionEsErrorIA) limpiarEstadoErrorIA()
  }

  function handleSubmit(event) {
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
    setShowSuccessModal(true)
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
      const imagenesBase64 = await prepararImagenesParaIA(
        fotosSubidas.map((slot) => slot.file)
      )
      const texto = (await describirFotosConIA(imagenesBase64)).trim()

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
    fileInputRefs.current = []
  }

  function handleCloseSuccessModal() {
    setShowSuccessModal(false)
    resetFormulario()
  }

  return (
    <main className="registrar">
      <h2 className="registrar__title">Registrar Incidencias</h2>

      <div className={`registrar__wrapper${modalAbierto ? ' registrar__wrapper--modal-open' : ''}`}>
        <form className="registrar__form" onSubmit={handleSubmit}>
          <fieldset className="registrar__fotos">
            <legend>Fotos a presentar:</legend>
            <div className="registrar__fotos-container">
              {fotos.map((slot, index) => (
                <div key={index} className="foto-slot">
                  <input
                    ref={(el) => {
                      fileInputRefs.current[index] = el
                    }}
                    type="file"
                    accept="image/*"
                    className="foto-slot__input"
                    onChange={(e) => handleFotoChange(index, e)}
                    aria-label={`Subir foto ${index + 1}`}
                  />
                  <button
                    type="button"
                    className="foto-slot__btn"
                    onClick={() => fileInputRefs.current[index]?.click()}
                  >
                    {slot.preview ? (
                      <>
                        <img src={slot.preview} alt={`Foto ${index + 1}`} className="foto-slot__preview" />
                        <button
                          type="button"
                          className="foto-slot__remove"
                          onClick={(e) => {
                            e.stopPropagation()
                            handleEliminarFoto(index)
                          }}
                          aria-label={`Quitar foto ${index + 1}`}
                        >
                          ×
                        </button>
                      </>
                    ) : (
                      <div className="foto-slot__upload-area">
                        <IconNube />
                        <span className="foto-slot__upload-text">Ingresa una foto</span>
                      </div>
                    )}
                  </button>
                </div>
              ))}
            </div>
          </fieldset>

          <div className="registrar__field">
            <label htmlFor="categoria">Selecciona una categoría</label>
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

          <div className="registrar__field">
            <label htmlFor="descripcion">Descripción sobre la incidencia:</label>
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
                  En PowerShell, antes de <code>spring-boot:run</code>:{' '}
                  <code>$env:HF_TOKEN=&quot;tu_token&quot;</code>
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
