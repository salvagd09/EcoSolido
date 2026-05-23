import './AIConfirmModal.css'

export default function AIConfirmModal({ onConfirm, onCancel }) {
  return (
    <div className="ai-modal-overlay" role="presentation" onClick={onCancel}>
      <div
        className="ai-modal"
        role="dialog"
        aria-labelledby="ai-modal-title"
        aria-modal="true"
        onClick={(e) => e.stopPropagation()}
      >
        <h2 id="ai-modal-title" className="ai-modal__title">
          Confirmación de generación de texto por IA
        </h2>
        <p className="ai-modal__message">
          ¿Estás seguro de hacer esto? Recuerda que solo va a describir las fotos que has
          enviado.
        </p>
        <div className="ai-modal__actions">
          <button type="button" className="ai-modal__btn ai-modal__btn--yes" onClick={onConfirm}>
            Sí
          </button>
          <button type="button" className="ai-modal__btn ai-modal__btn--no" onClick={onCancel}>
            No
          </button>
        </div>
      </div>
    </div>
  )
}
