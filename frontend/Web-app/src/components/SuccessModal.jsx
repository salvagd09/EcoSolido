import { IconCerrar } from './icons'
import './SuccessModal.css'

export default function SuccessModal({ onClose, puntosGanados = 0 }) {
  return (
    <div className="modal-overlay" role="presentation" onClick={onClose}>
      <div
        className="modal"
        role="dialog"
        aria-labelledby="modal-title"
        aria-modal="true"
        onClick={(e) => e.stopPropagation()}
      >
        <button
          type="button"
          className="modal__close"
          onClick={onClose}
          aria-label="Cerrar"
        >
          <IconCerrar />
        </button>
        <h2 id="modal-title" className="modal__title">
          Felicidades
        </h2>
        <p className="modal__message">
          Su incidencia ha sido registrada exitosamente y ha sido establecida como
          Pendiente en el panel de 'Seguimiento de Incidencias'.
        </p>
        {puntosGanados > 0 && (
          <p className="modal__points">
            🎉 ¡Has ganado <strong>{puntosGanados}</strong> puntos!
          </p>
        )}
      </div>
    </div>
  )
}
