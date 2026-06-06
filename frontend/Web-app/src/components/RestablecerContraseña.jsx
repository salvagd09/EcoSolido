import { useState } from "react"
import { useNavigate } from "react-router-dom"
import './RestablecerContraseña.css'

export default function RestablecerContra() {
    const navigate = useNavigate();
    
    // Estados para el flujo de múltiples pasos
    const [paso, setPaso] = useState(1); // 1: verificar, 2: pregunta seguridad, 3: verificar respuesta, 4: nueva contraseña
    const [telOCel, setTelOCel] = useState("");
    const [correo, setCorreo] = useState("");
    const [usarTelefono, setUsarTelefono] = useState(true);
    const [preguntaSeguridad, setPreguntaSeguridad] = useState("");
    const [respuestaSeguridad, setRespuestaSeguridad] = useState("");
    const [nuevaContrasena, setNuevaContrasena] = useState("");
    const [confirmarContrasena, setConfirmarContrasena] = useState("");
    const [error, setError] = useState(null);
    const [success, setSuccess] = useState(null);

    // Paso 1: Verificar correo o teléfono
    const handleVerificar = async (e) => {
        e.preventDefault();
        setError(null);
        setSuccess(null);

        const campo = usarTelefono ? telOCel : correo;
        if (!campo.trim()) {
            setError(`Por favor ingresa tu ${usarTelefono ? 'teléfono' : 'correo electrónico'}`);
            return;
        }

        try {
            const body = usarTelefono 
                ? { telefono: campo } 
                : { correo: campo };

            const respuesta = await fetch("http://localhost:8080/usuario/verificar-cor-o-tel", {
                method: "POST",
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(body)
            });

            if (!respuesta.ok) {
                const errorText = await respuesta.text();
                throw new Error(errorText);
            }

            const data = await respuesta.json();
            
            // Si es teléfono, guardamos para usar después
            if (usarTelefono) {
                setTelOCel(campo);
            } else {
                setCorreo(campo);
            }

            // Paso 2: Obtener pregunta de seguridad
            await handleObtenerPreguntaSeguridad(campo);
        } catch (error) {
            setError(error.message);
        }
    };

    // Paso 2: Obtener pregunta de seguridad
    const handleObtenerPreguntaSeguridad = async (campo) => {
        try {
            const params = usarTelefono 
                ? `?telefono=${encodeURIComponent(campo)}` 
                : `?correo=${encodeURIComponent(campo)}`;

            const respuesta = await fetch(`http://localhost:8080/usuario/pregunta-seguridad${params}`, {
                method: "GET",
                headers: { 'Content-Type': 'application/json' }
            });

            if (!respuesta.ok) {
                const errorText = await respuesta.text();
                throw new Error(errorText);
            }

            const data = await respuesta.json();
            setPreguntaSeguridad(data.pregunta);
            setPaso(2);
        } catch (error) {
            setError(error.message);
        }
    };

    // Paso 3: Verificar respuesta de seguridad
    const handleVerificarRespuesta = async (e) => {
        e.preventDefault();
        setError(null);
        setSuccess(null);

        if (!respuestaSeguridad.trim()) {
            setError('Por favor ingresa tu respuesta');
            return;
        }

        try {
            const body = usarTelefono 
                ? { telefono: telOCel, respuesta: respuestaSeguridad }
                : { correo: correo, respuesta: respuestaSeguridad };

            const respuesta = await fetch("http://localhost:8080/usuario/verificar-respuesta", {
                method: "POST",
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(body)
            });

            if (!respuesta.ok) {
                const errorText = await respuesta.text();
                throw new Error(errorText);
            }

            setSuccess('Respuesta verificada correctamente');
            setPaso(3);
        } catch (error) {
            setError(error.message);
        }
    };

    // Paso 4: Restablecer contraseña
    const handleRestablecerContrasena = async (e) => {
        e.preventDefault();
        setError(null);
        setSuccess(null);

        if (nuevaContrasena.length < 6) {
            setError('La contraseña debe tener al menos 6 caracteres');
            return;
        }

        if (nuevaContrasena !== confirmarContrasena) {
            setError('Las contraseñas no coinciden');
            return;
        }

        try {
            const body = usarTelefono
                ? {
                    telefono: telOCel,
                    nuevaContrasena: nuevaContrasena,
                    nuevaContrasenaRepetida: confirmarContrasena
                }
                : {
                    correo: correo,
                    nuevaContrasena: nuevaContrasena,
                    nuevaContrasenaRepetida: confirmarContrasena
                };

            const respuesta = await fetch("http://localhost:8080/usuario/restablecer-contrasena", {
                method: "PATCH",
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(body)
            });

            if (!respuesta.ok) {
                const errorText = await respuesta.text();
                throw new Error(errorText);
            }

            setSuccess('¡Contraseña restablecida exitosamente! Redirigiendo al login...');
            setTimeout(() => {
                navigate("/login");
            }, 3000);
        } catch (error) {
            setError(error.message);
        }
    };

    const handleVolver = () => {
        if (paso > 1) {
            setPaso(paso - 1);
            setError(null);
            setSuccess(null);
        }
    };

    return (
        <div className="restablecer">
            <div className="restablecer__container">
                <div className="restablecer__logo">
                    <svg className="restablecer__logo-icon" fill="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                        <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z"/>
                    </svg>
                    <h1 className="restablecer__title">EcoSólido</h1>
                    <p className="restablecer__subtitle">Recupera tu contraseña</p>
                </div>

                {/* Indicador de pasos */}
                <div className="restablecer__steps">
                    <div className={`restablecer__step ${paso >= 1 ? 'active' : ''}`}>1. Verificar</div>
                    <div className={`restablecer__step ${paso >= 2 ? 'active' : ''}`}>2. Pregunta</div>
                    <div className={`restablecer__step ${paso >= 3 ? 'active' : ''}`}>3. Nueva contraseña</div>
                </div>

                {error && (
                    <div className="restablecer__error">
                        {error}
                    </div>
                )}

                {success && (
                    <div className="restablecer__success">
                        {success}
                    </div>
                )}

                {/* Paso 1: Verificar correo o teléfono */}
                {paso === 1 && (
                    <>
                        <div className="restablecer__info">
                            Ingresa el correo electrónico o número de teléfono asociado a tu cuenta.
                        </div>

                        <div className="restablecer__toggle">
                            <button 
                                type="button"
                                className={`restablecer__toggle-btn ${usarTelefono ? 'active' : ''}`}
                                onClick={() => setUsarTelefono(true)}
                            >
                                Teléfono
                            </button>
                            <button 
                                type="button"
                                className={`restablecer__toggle-btn ${!usarTelefono ? 'active' : ''}`}
                                onClick={() => setUsarTelefono(false)}
                            >
                                Correo
                            </button>
                        </div>

                        <form className="restablecer__form" onSubmit={handleVerificar}>
                            <div className="restablecer__field">
                                <label htmlFor={usarTelefono ? "telefono" : "correo"}>
                                    {usarTelefono ? "Teléfono o celular" : "Correo electrónico"}
                                </label>
                                <input 
                                    type={usarTelefono ? "tel" : "email"}
                                    id={usarTelefono ? "telefono" : "correo"}
                                    placeholder={usarTelefono ? "Ingresa tu número de teléfono" : "Ingresa tu correo electrónico"}
                                    maxLength={usarTelefono? "9":"500"}
                                    value={usarTelefono ? telOCel : correo}
                                    onChange={(e) => usarTelefono ? setTelOCel(e.target.value) : setCorreo(e.target.value)}
                                    required
                                />
                            </div>

                            <div className="restablecer__actions">
                                <button type="submit" className="restablecer__submit">
                                    Verificar
                                </button>
                            </div>
                        </form>
                    </>
                )}

                {/* Paso 2: Pregunta de seguridad */}
                {paso === 2 && (
                    <>
                        <div className="restablecer__info">
                            Responde la siguiente pregunta de seguridad para verificar tu identidad.
                        </div>

                        <div className="restablecer__question">
                            <strong>Pregunta de seguridad:</strong>
                            <p>{preguntaSeguridad}</p>
                        </div>

                        <form className="restablecer__form" onSubmit={handleVerificarRespuesta}>
                            <div className="restablecer__field">
                                <label htmlFor="respuesta">Tu respuesta</label>
                                <input 
                                    type="text"
                                    id="respuesta"
                                    placeholder="Escribe tu respuesta"
                                    value={respuestaSeguridad}
                                    onChange={(e) => setRespuestaSeguridad(e.target.value)}
                                    required
                                />
                            </div>

                            <div className="restablecer__actions">
                                <button type="button" className="restablecer__back" onClick={handleVolver}>
                                    Volver
                                </button>
                                <button type="submit" className="restablecer__submit">
                                    Verificar Respuesta
                                </button>
                            </div>
                        </form>
                    </>
                )}

                {/* Paso 3: Nueva contraseña */}
                {paso === 3 && (
                    <>
                        <div className="restablecer__info">
                            Ingresa tu nueva contraseña.
                        </div>

                        <form className="restablecer__form" onSubmit={handleRestablecerContrasena}>
                            <div className="restablecer__field">
                                <label htmlFor="nuevaContrasena">Nueva contraseña</label>
                                <input 
                                    type="password"
                                    id="nuevaContrasena"
                                    placeholder="Mínimo 6 caracteres"
                                    value={nuevaContrasena}
                                    onChange={(e) => setNuevaContrasena(e.target.value)}
                                    required
                                />
                            </div>

                            <div className="restablecer__field">
                                <label htmlFor="confirmarContrasena">Confirmar nueva contraseña</label>
                                <input 
                                    type="password"
                                    id="confirmarContrasena"
                                    placeholder="Repite tu nueva contraseña"
                                    value={confirmarContrasena}
                                    onChange={(e) => setConfirmarContrasena(e.target.value)}
                                    required
                                />
                            </div>

                            <div className="restablecer__actions">
                                <button type="button" className="restablecer__back" onClick={handleVolver}>
                                    Volver
                                </button>
                                <button type="submit" className="restablecer__submit">
                                    Restablecer Contraseña
                                </button>
                            </div>
                        </form>
                    </>
                )}

                <div className="restablecer__links">
                    <p>¿Recordaste tu contraseña?</p>
                    <button 
                        type="button" 
                        className="restablecer__link"
                        onClick={() => navigate("/login")}
                    >
                        Volver al inicio de sesión
                    </button>
                </div>
            </div>
        </div>
    )
}