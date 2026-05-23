import { IconCerrar } from './icons'
import './SuccessModal.css'

export default function SuccessModal({ onClose }) {
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
          Pendiente en el panel de &apos;Seguimiento de Incidencias&apos;
        </p>
      </div>
    </div>
  )
}
