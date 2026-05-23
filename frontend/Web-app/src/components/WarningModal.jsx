import './WarningModal.css'

export default function WarningModal({ onClose, message }) {
  return (
    <div className="warning-modal-overlay" role="presentation" onClick={onClose}>
      <div
        className="warning-modal"
        role="dialog"
        aria-labelledby="warning-modal-title"
        aria-modal="true"
        onClick={(e) => e.stopPropagation()}
      >
        <h2 id="warning-modal-title" className="warning-modal__title">
          Advertencia ⚠
        </h2>
        <p className="warning-modal__message">
          Su incidencia no se ha podido registrar.<br />
          {message || 'No ha colocado foto alguna.'}
        </p>
        <div className="warning-modal__actions">
          <button
            type="button"
            className="warning-modal__btn"
            onClick={onClose}
          >
            Aceptar
          </button>
        </div>
      </div>
    </div>
  )
}
