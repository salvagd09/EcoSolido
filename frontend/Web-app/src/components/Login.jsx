import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../hooks/useAuth'
import './Login.css'

export default function Login({ onLogin }) {
    const [nombreUs, setNombreUs] = useState("")
    const [contra, setContra] = useState("")
    const navigate = useNavigate();
    const [error, setError] = useState(null);
    const [verContra, setVerContra] = useState(false)
    const { login } = useAuth();
    
    const handleSubmit = async (e) => {
        e.preventDefault()
        const result = await login(nombreUs, contra);
        
        if (result.success) {
            onLogin?.();
            navigate("/registro");
        } else {
            setError(result.error);
        }
    }

    return (
        <div className="login">
            <div className="login__container">
                <div className="login__logo">
                    <svg className="login__logo-icon" fill="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                        <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z" />
                    </svg>
                    <h1 className="login__title">EcoSólido</h1>
                    <p className="login__subtitle">Inicia sesión para gestionar incidencias</p>
                </div>

                {error && (
                    <div className="login__error">
                        {error}
                    </div>
                )}

                <form className="login__form" onSubmit={handleSubmit}>
                    <div className="login__field">
                        <label htmlFor="username">Nombre de usuario</label>
                        <input
                            type="text"
                            id="username"
                            placeholder="Ingresa tu nombre de usuario"
                            value={nombreUs}
                            onChange={(e) => setNombreUs(e.target.value)}
                            required
                        />
                    </div>

                    <div className="login__field">
                        <label htmlFor="contrasena">Contraseña</label>
                        <div className="login__input-wrapper">
                            <input
                                type={verContra ? "text" : "password"}  // ← alterna el tipo
                                id="contrasena"
                                placeholder="Ingresa tu contraseña"
                                value={contra}
                                onChange={(e) => setContra(e.target.value)}
                                required
                            />
                            <button
                                type="button"
                                className="login__toggle-pass"
                                onClick={() => setVerContra(prev => !prev)}
                                aria-label={verContra ? "Ocultar contraseña" : "Ver contraseña"}
                            >
                                <span className="material-symbols-outlined">
                                    {verContra ? "visibility" : "visibility_off"}
                                </span>
                            </button>
                        </div>
                    </div>

                    <div className="login__actions">
                        <button type="submit" className="login__submit">
                            Iniciar Sesión
                        </button>
                    </div>
                </form>

                <div className="login__links">
                    <p>¿Aún no tienes cuenta?</p>
                    <button
                        type="button"
                        className="login__link"
                        onClick={() => navigate("/registrarse")}
                    >
                        Regístrate aquí
                    </button>
                    <p>¿Olvidaste tu contraseña?</p>
                    <button
                        type="button"
                        className="login__link"
                        onClick={() => navigate("/restablecer")}
                    >
                        Restablecer Contraseña
                    </button>
                </div>
            </div>
        </div>
    )
}