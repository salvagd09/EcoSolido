import './HelpModal.css'

const PASOS = [
    {
        titulo: "1. Sube tus fotos",
        descripcion: "Arrastra o selecciona hasta 5 fotos del problema. Formatos aceptados: JPG, PNG, WEBP. Máximo 50 MB en total."
    },
    {
        titulo: "2. Selecciona una categoría",
        descripcion: "Elige la categoría que mejor describa la incidencia (basura, contenedor dañado, escombros, etc.)."
    },
    {
        titulo: "3. Escribe o genera una descripción",
        descripcion: "Describe el problema con detalle o usa el botón de IA para generar una descripción automática a partir de tus fotos."
    },
    {
        titulo: "4. Registra la incidencia",
        descripcion: "Haz click en 'Registrar incidencia'. Recibirás una confirmación y tu reporte quedará guardado en el sistema."
    }
]

const FAQS = [
    {
        pregunta: "¿Cuánto tarda en revisarse mi reporte?",
        respuesta: "El equipo municipal revisa los reportes en un plazo de 24 a 48 horas hábiles."
    },
    {
        pregunta: "¿Qué pasa después de enviar?",
        respuesta: "Tu incidencia queda registrada y puedes hacer seguimiento desde la sección 'Seguimiento de Incidencias'."
    },
    {
        pregunta: "¿Puedo registrar sin fotos?",
        respuesta: "No, al menos una foto es obligatoria para validar la incidencia."
    },
    {
        pregunta: "¿Qué hace la IA?",
        respuesta: "Analiza tus fotos y genera automáticamente una descripción del problema. Puedes editarla antes de enviar."
    }
]

export default function HelpModal({ onClose }) {
    return (
        <div className="help-modal-overlay" role="presentation" onClick={onClose}>
            <div
                className="help-modal"
                role="dialog"
                aria-labelledby="help-modal-title"
                aria-modal="true"
                onClick={(e) => e.stopPropagation()}
            >
                <div className="help-modal__header">
                    <h2 id="help-modal-title" className="help-modal__title">
                        ¿Cómo funciona?
                    </h2>
                    <button
                        type="button"
                        className="help-modal__close"
                        onClick={onClose}
                        aria-label="Cerrar ayuda"
                    >
                        ×
                    </button>
                </div>

                <div className="help-modal__body">
                    <h3 className="help-modal__section-title">Pasos para registrar una incidencia</h3>
                    <ol className="help-modal__steps">
                        {PASOS.map((paso, i) => (
                            <li key={i} className="help-modal__step">
                                <strong>{paso.titulo}</strong>
                                <p>{paso.descripcion}</p>
                            </li>
                        ))}
                    </ol>

                    <h3 className="help-modal__section-title">Preguntas frecuentes</h3>
                    <ul className="help-modal__faqs">
                        {FAQS.map((faq, i) => (
                            <li key={i} className="help-modal__faq">
                                <strong>{faq.pregunta}</strong>
                                <p>{faq.respuesta}</p>
                            </li>
                        ))}
                    </ul>
                </div>
            </div>
        </div>
    )
}