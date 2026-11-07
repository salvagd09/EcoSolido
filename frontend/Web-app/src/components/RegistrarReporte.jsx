import { useRef, useState, lazy, Suspense } from 'react'
import { registrarReporte } from '../services/reportesApi'
import { useAuth } from '../hooks/useAuth'
import { IconNube } from './icons'
import './RegistrarIncidencias.css'
import HelpModal from './HelpModal'

const SuccessModal = lazy(() => import('./SuccessModal'))
const WarningModal = lazy(() => import('./WarningModal'))

const MAX_FOTOS = 2
const MAX_OBSERVACIONES = 300

// Deben coincidir con el enum TipoResiduo del backend
const TIPOS_RESIDUO = [
  { valor: 'PAPEL', etiqueta: 'Papel' },
  { valor: 'CARTON', etiqueta: 'Cartón' },
  { valor: 'PET', etiqueta: 'Botellas PET' },
  { valor: 'PLASTICO_DURO', etiqueta: 'Plástico duro' },
  { valor: 'VIDRIO', etiqueta: 'Vidrio' },
  { valor: 'METAL_ENVASES', etiqueta: 'Latas y envases metálicos' },
  { valor: 'TETRAPAK', etiqueta: 'Tetra Pak' },
]

const TIPOS_COMPROBANTE = [
  { valor: 'BOLETA', etiqueta: 'Boleta' },
  { valor: 'FACTURA', etiqueta: 'Factura' },
  { valor: 'LIQUIDACION', etiqueta: 'Liquidación de compra' },
]

// Temporal, hasta tener GET /receptores en el backend
const RECEPTORES_PRUEBA = [
  { id: 1, razonSocial: 'ASOCIACION DE RECICLADORES DEMO CARABAYLLO' },
  { id: 2, razonSocial: 'EO-RS DEMO NORTE S.A.C.' },
]

// Fecha local en formato AAAA-MM-DD (toISOString usaría UTC)
const hoy = () => new Date().toLocaleDateString('en-CA')

const SIN_ERRORES = {
  fotos: false,
  tipoResiduo: false,
  pesoKg: false,
  receptor: false,
  comprobante: false,
  declaracion: false,
}

export default function RegistrarReportes({ onIncidenciaRegistrada }) {
  // Fotos del comprobante
  const [fotos, setFotos] = useState([])
  const [isDragging, setIsDragging] = useState(false)
  const fileInputRef = useRef(null)

  // Datos del reporte
  const [fechaEntrega, setFechaEntrega] = useState(hoy())
  const [tipoResiduo, setTipoResiduo] = useState('')
  const [pesoKg, setPesoKg] = useState('')
  const [receptorId, setReceptorId] = useState('')
  const [tipoComprobante, setTipoComprobante] = useState('')
  const [serie, setSerie] = useState('')
  const [numero, setNumero] = useState('')
  const [observaciones, setObservaciones] = useState('')
  const [declaraNoProceso, setDeclaraNoProceso] = useState(false)

  // Interfaz
  const [camposError, setCamposError] = useState(SIN_ERRORES)
  const [enviando, setEnviando] = useState(false)
  const [showSuccessModal, setShowSuccessModal] = useState(false)
  const [showWarningModal, setShowWarningModal] = useState(false)
  const [warningMessage, setWarningMessage] = useState('')
  const [showHelpModal, setShowHelpModal] = useState(false)
  const [tamañoLetra, setTamañoLetra] = useState(1)

  const { user } = useAuth()
  // El login debe guardar el giro (en user o en localStorage)
  const giro = user?.giro ?? localStorage.getItem('giro')
  const esManufactura = giro === 'MANUFACTURA'

  const tieneFotos = fotos.length > 0
  const modalAbierto = showSuccessModal || showWarningModal

  function avisar(mensaje, campo) {
    if (campo) setCamposError(prev => ({ ...prev, [campo]: true }))
    setWarningMessage(mensaje)
    setShowWarningModal(true)
  }

  function limpiarError(campo) {
    setCamposError(prev => ({ ...prev, [campo]: false }))
  }

  // ---------- Fotos ----------
  function agregarFotos(files) {
    if (!files.length) return
    setFotos(prev => {
      const espacio = MAX_FOTOS - prev.length
      const nuevas = files.slice(0, espacio).map(file => ({
        preview: URL.createObjectURL(file),
        file,
      }))
      return [...prev, ...nuevas]
    })
    limpiarError('fotos')
  }

  function handleFotoChange(event) {
    agregarFotos(Array.from(event.target.files ?? []))
    event.target.value = ''
  }

  function handleDrop(e) {
    e.preventDefault()
    setIsDragging(false)
    agregarFotos(Array.from(e.dataTransfer.files).filter(f => f.type.startsWith('image/')))
  }

  function handleEliminarFoto(index) {
    setFotos(prev => {
      URL.revokeObjectURL(prev[index].preview)
      return prev.filter((_, i) => i !== index)
    })
  }

  const comprimirImagen = (file) => {
    return new Promise((resolve) => {
      const reader = new FileReader()
      reader.readAsDataURL(file)
      reader.onload = (event) => {
        const img = new Image()
        img.src = event.target.result
        img.onload = () => {
          const canvas = document.createElement('canvas')
          const MAX_LADO = 1200
          let { width, height } = img
          if (width > height && width > MAX_LADO) {
            height *= MAX_LADO / width
            width = MAX_LADO
          } else if (height >= width && height > MAX_LADO) {
            width *= MAX_LADO / height
            height = MAX_LADO
          }
          canvas.width = width
          canvas.height = height
          canvas.getContext('2d').drawImage(img, 0, 0, width, height)
          // Calidad un poco mayor que antes: el comprobante debe leerse bien
          canvas.toBlob((blob) => {
            resolve(new File([blob], file.name, { type: 'image/jpeg', lastModified: Date.now() }))
          }, 'image/jpeg', 0.8)
        }
      }
    })
  }

  // ---------- Envío ----------
  async function handleSubmit(event) {
    event.preventDefault()
    setCamposError(SIN_ERRORES)

    if (!tieneFotos) return avisar('Suba la foto del comprobante.', 'fotos')
    if (!tipoResiduo) return avisar('Seleccione el tipo de residuo.', 'tipoResiduo')
    if (!pesoKg || Number(pesoKg) <= 0) return avisar('Ingrese un peso mayor a 0 kg.', 'pesoKg')
    if (!receptorId) return avisar('Seleccione el receptor al que entregó el residuo.', 'receptor')
    if (!tipoComprobante) return avisar('Seleccione el tipo de comprobante.', 'comprobante')
    if (!/^[A-Z0-9]{4}$/.test(serie)) return avisar('La serie debe tener 4 caracteres (ej.: B001).', 'comprobante')
    if (!/^\d{1,8}$/.test(numero)) return avisar('El número debe tener hasta 8 dígitos.', 'comprobante')
    if (esManufactura && !declaraNoProceso) {
      return avisar('Debe aceptar la declaración sobre el origen del residuo.', 'declaracion')
    }

    const datos = {
      fechaEntrega,
      tipoResiduo,
      pesoKg: Number(pesoKg),
      receptorId: Number(receptorId),
      tipoComprobante,
      serie,
      numero,
      observaciones: observaciones.trim() || null,
      declaraNoProceso,
    }

    setEnviando(true)
    try {
      const fotosComprimidas = await Promise.all(fotos.map(f => comprimirImagen(f.file)))
      const reporteCreado = await registrarReporte(datos, [], fotosComprimidas)
      if (onIncidenciaRegistrada) onIncidenciaRegistrada(reporteCreado)
      setShowSuccessModal(true)
    } catch (err) {
      // Sin modo offline: un reporte sin backend no sirve como evidencia
      avisar(err.message ?? 'Error al registrar el reporte.')
    } finally {
      setEnviando(false)
    }
  }

  function resetFormulario() {
    fotos.forEach(f => URL.revokeObjectURL(f.preview))
    setFotos([])
    setFechaEntrega(hoy())
    setTipoResiduo('')
    setPesoKg('')
    setReceptorId('')
    setTipoComprobante('')
    setSerie('')
    setNumero('')
    setObservaciones('')
    setDeclaraNoProceso(false)
    setCamposError(SIN_ERRORES)
  }

  function handleCloseSuccessModal() {
    setShowSuccessModal(false)
    resetFormulario()
  }

  const claseError = (campo) => (camposError[campo] ? 'campo-error' : '')

  return (
    <main className="registrar" style={{ '--font-scale': tamañoLetra }}>
      <h2 className="registrar__title">Registrar entrega de residuos</h2>
      <div className="registrar__controles-texto">
        <button type="button" className="registrar__help-btn" onClick={() => setShowHelpModal(true)}>
          ¿Cómo funciona?
        </button>
        <div className="registrar__font-controls">
          <button type="button" onClick={() => setTamañoLetra(t => Math.max(0.8, t - 0.1))}>🗛-</button>
          <button type="button" onClick={() => setTamañoLetra(1)}>A</button>
          <button type="button" onClick={() => setTamañoLetra(t => Math.min(1.7, t + 0.1))}>🗚+</button>
        </div>
      </div>

      <div className={`registrar__wrapper${modalAbierto ? ' registrar__wrapper--modal-open' : ''}`}>
        <form className="registrar__form" onSubmit={handleSubmit}>
          <fieldset
            className={`registrar__fotos ${isDragging ? 'dragging' : ''}`}
            onDragOver={(e) => { e.preventDefault(); setIsDragging(true) }}
            onDragLeave={() => setIsDragging(false)}
            onDrop={handleDrop}
          >
            <legend>Foto del comprobante: <span style={{ color: '#ff7a00' }}>*</span></legend>
            <div className="registrar__fotos-container">
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                multiple
                className="foto-slot__input"
                onChange={handleFotoChange}
                aria-label="Subir fotos del comprobante"
              />
              <button
                type="button"
                className={`foto-slot__btn ${claseError('fotos')}`}
                onClick={() => fileInputRef.current?.click()}
                disabled={fotos.length >= MAX_FOTOS}
              >
                <div className="foto-slot__upload-area">
                  <IconNube />
                  <span className="foto-slot__upload-text">
                    {tieneFotos
                      ? `${fotos.length} de ${MAX_FOTOS} foto(s) seleccionada(s)`
                      : 'Ingrese o arrastre la foto del comprobante'}
                  </span>
                </div>
              </button>

              <div className="registrar__fotos-preview">
                {fotos.map((slot, index) => (
                  <div key={slot.preview} className="foto-slot">
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
              Hasta {MAX_FOTOS} fotos: el comprobante y, si tiene, el ticket de pesaje.
            </p>
          </fieldset>

          <div className="registrar__field">
            <label htmlFor="fechaEntrega">Fecha de entrega <span style={{ color: '#ff7a00' }}>*</span></label>
            <input
              type="date"
              id="fechaEntrega"
              max={hoy()}
              value={fechaEntrega}
              onChange={e => setFechaEntrega(e.target.value)}
              required
            />
          </div>

          <div className="registrar__field">
            <label htmlFor="tipoResiduo">Tipo de residuo <span style={{ color: '#ff7a00' }}>*</span></label>
            <div className="registrar__select-wrap">
              <select
                id="tipoResiduo"
                className={claseError('tipoResiduo')}
                value={tipoResiduo}
                onChange={e => { setTipoResiduo(e.target.value); limpiarError('tipoResiduo') }}
              >
                <option value="" disabled>Seleccione una opción</option>
                {TIPOS_RESIDUO.map(t => <option key={t.valor} value={t.valor}>{t.etiqueta}</option>)}
              </select>
            </div>
          </div>

          <div className="registrar__field">
            <label htmlFor="pesoKg">Peso (kg) <span style={{ color: '#ff7a00' }}>*</span></label>
            <input
              type="number"
              id="pesoKg"
              className={claseError('pesoKg')}
              min="0.1"
              step="0.01"
              value={pesoKg}
              onChange={e => { setPesoKg(e.target.value); limpiarError('pesoKg') }}
              placeholder="Ej.: 40.5"
            />
          </div>

          <div className="registrar__field">
            <label htmlFor="receptor">Receptor autorizado <span style={{ color: '#ff7a00' }}>*</span></label>
            <div className="registrar__select-wrap">
              <select
                id="receptor"
                className={claseError('receptor')}
                value={receptorId}
                onChange={e => { setReceptorId(e.target.value); limpiarError('receptor') }}
              >
                <option value="" disabled>Seleccione el receptor</option>
                {RECEPTORES_PRUEBA.map(r => <option key={r.id} value={r.id}>{r.razonSocial}</option>)}
              </select>
            </div>
          </div>

          <div className="registrar__field">
            <label htmlFor="tipoComprobante">Comprobante <span style={{ color: '#ff7a00' }}>*</span></label>
            <div className="registrar__select-wrap">
              <select
                id="tipoComprobante"
                className={claseError('comprobante')}
                value={tipoComprobante}
                onChange={e => { setTipoComprobante(e.target.value); limpiarError('comprobante') }}
              >
                <option value="" disabled>Tipo de comprobante</option>
                {TIPOS_COMPROBANTE.map(t => <option key={t.valor} value={t.valor}>{t.etiqueta}</option>)}
              </select>
            </div>
            <input
              type="text"
              className={claseError('comprobante')}
              maxLength="4"
              placeholder="Serie (B001)"
              aria-label="Serie del comprobante"
              value={serie}
              onChange={e => { setSerie(e.target.value.toUpperCase()); limpiarError('comprobante') }}
            />
            <input
              type="text"
              className={claseError('comprobante')}
              inputMode="numeric"
              maxLength="8"
              placeholder="Número"
              aria-label="Número del comprobante"
              value={numero}
              onChange={e => { setNumero(e.target.value.replace(/\D/g, '')); limpiarError('comprobante') }}
            />
          </div>

          {esManufactura && (
            <label className={`registrar__declaracion ${claseError('declaracion')}`}>
              <input
                type="checkbox"
                checked={declaraNoProceso}
                onChange={e => { setDeclaraNoProceso(e.target.checked); limpiarError('declaracion') }}
              />
              Declaro que este residuo proviene de actividades de oficina o del consumo del personal,
              y no del proceso productivo.
            </label>
          )}

          <div className="registrar__field">
            <label htmlFor="observaciones">Observaciones (opcional)</label>
            <textarea
              id="observaciones"
              rows={3}
              maxLength={MAX_OBSERVACIONES}
              value={observaciones}
              onChange={e => setObservaciones(e.target.value)}
            />
            <span className="registrar__contador">
              {MAX_OBSERVACIONES - observaciones.length} caracteres restantes
            </span>
          </div>

          <span style={{ color: '#ff7a00' }}>*Campo obligatorio</span>

          <div className="registrar__actions">
            <button type="submit" className="registrar__btn registrar__btn--primary" disabled={enviando}>
              {enviando ? 'Enviando...' : 'Registrar reporte'}
            </button>
          </div>
        </form>

        {showSuccessModal && (
          <Suspense fallback={<div>Cargando...</div>}>
            <SuccessModal onClose={handleCloseSuccessModal} />
          </Suspense>
        )}
        {showWarningModal && (
          <Suspense fallback={<div className="modal-loading">Cargando...</div>}>
            <WarningModal message={warningMessage} onClose={() => setShowWarningModal(false)} />
          </Suspense>
        )}
        {showHelpModal && <HelpModal onClose={() => setShowHelpModal(false)} fontScale={tamañoLetra} />}
      </div>
    </main>
  )
}