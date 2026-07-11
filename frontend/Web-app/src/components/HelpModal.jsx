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
    },
    {   pregunta: "¿Para qué sirven los botones 🗛+,A y 🗚-?",
        respuesta:"Son botones que permiten modificar el tamaño de la fuente de los títulos, subtítulos y otros campos textuales. 🗛+ aumenta el tamaño,A lo regresa a su tamaño original y 🗚- disminuye el tamaño"
    },
    {   pregunta: "¿Para qué sirven el bóton de la luna que se encuentra junto a mi nombre?",
        respuesta:"Sirve para cambiar la pestaña a modo nocturno para que sea más fácil de ver en la noche. En caso quiera retornar al modo de vista por defecto, presione otra vez el botón que ahora estará con el símbolo del sol "
    },
    {   pregunta: "¿Cómo funciona el botón de dictar descripción?",
        respuesta:"Funciona de manera similar al botón de grabación de voz de WhatsApp. Mantén presionado el botón mientras dictas la descripción de la incidencia y tu voz se convertirá automáticamente en texto, permitiéndote registrar el reporte de forma más rápida."
    }
]

export default function HelpModal({ onClose,fontScale = 1 }) {
    return (
        <div className="help-modal-overlay" role="presentation" onClick={onClose} style={{ '--font-scale': fontScale }}>
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
