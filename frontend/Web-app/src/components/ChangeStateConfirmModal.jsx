import './AIConfirmModal.css'

export default function ChangeStateConfirmModal({ onConfirm, onCancel,estado }) {
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
          Confirmación de cambio de estado de Incidencia
        </h2>
        {estado=="PENDIENTE" && (<>
        <p className="ai-modal__message">
          ¿Estás seguro de querer cambiar el estado de incidencia a En Proceso?
        </p></>)}
        {estado=="EN_PROCESO" && (<>
        <p className="ai-modal__message">
          ¿Estás seguro de querer cambiar el estado de incidencia a Resuelto?
        </p></>)}
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