import './CerrarSesionModal.css'
export default function CerrarSesionModal({ onConfirm, onCancel }) {
  return (
    <div className="cerrar-modal-overlay" role="presentation" onClick={onCancel}>
      <div
        className="cerrar-modal"
        role="dialog"
        aria-labelledby="cerrar-modal-title"
        aria-modal="true"
        onClick={(e) => e.stopPropagation()}
      >
        <h2 id="cerrar-modal-title" className="cerrar-modal__title">
          Confirmación de cierre de sesión
        </h2>
        <p className="cerrar-modal__message">
          ¿Estás seguro de hacer esto?
        </p>
        <div className="cerrar-modal__actions">
          <button type="button" className="cerrar-modal__btn cerrar-modal__btn--yes" onClick={onConfirm}>
            Sí
          </button>
          <button type="button" className="cerrar-modal__btn cerrar-modal__btn--no" onClick={onCancel}>
            No
          </button>
        </div>
      </div>
    </div>
  )
}