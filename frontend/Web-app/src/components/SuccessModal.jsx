import { IconCerrar } from './icons'
import './SuccessModal.css'

export default function SuccessModal({ onClose, puntosGanados = 0, nuevasInsignias = [] }) {
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
        {nuevasInsignias.length > 0 && (
          <div className="modal__badges">
            <p className="modal__badges-title">🏅 ¡Nueva(s) insignia(s) desbloqueada(s)!</p>
            <ul className="modal__badges-list">
              {nuevasInsignias.map((insignia, index) => (
                <li key={index} className="modal__badge-item">
                  <strong>{typeof insignia === 'string' ? insignia : insignia.nombre}</strong>
                  {(typeof insignia !== 'string' && insignia.recompensa) && (
                    <span className="modal__badge-recompensa"> — 🎁 {insignia.recompensa}</span>
                  )}
                </li>
              ))}
            </ul>
            <p className="modal__badges-hint">
              Ya puedes visualizarla(s) y canjear los beneficios asociados en "Recompensas al Ciudadano".
            </p>
          </div>
        )}
      </div>
    </div>
  )
}
