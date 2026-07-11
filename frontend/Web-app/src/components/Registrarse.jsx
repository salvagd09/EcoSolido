import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import './Registrarse.css'

export default function Registrarse() {
    const navigate = useNavigate();
    const [formData, setFormData] = useState({
        nombre: '',
        apellido: '',
        email: '',
        telefono: '',
        DNI: '',
        nombreUsuario: '',
        contrasena: '',
        confirmarContrasena: '',
        pregunta: '',
        respuesta: ''
    });
    const [error, setError] = useState(null);
    const [success, setSuccess] = useState(null);
    const [verContra, setVerContra] = useState(false)
    const [verContraRepetida, setVerContraRepetida] = useState(false)
    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError(null);
        setSuccess(null);

        // Validaciones básicas
        if (formData.contrasena !== formData.confirmarContrasena) {
            setError('Las contraseñas no coinciden');
            return;
        }

        if (formData.contrasena.length < 6) {
            setError('La contraseña debe tener al menos 6 caracteres');
            return;
        }

        try {
            const respuesta = await fetch("http://localhost:8080/usuario/registrar", {
                method: "POST",
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    nombreCompleto: formData.nombre,
                    apellidoCompleto: formData.apellido,
                    dni: formData.DNI,
                    telefono: formData.telefono,
                    correoElectronico: formData.email,
                    nombreUsuario: formData.nombreUsuario,
                    contrasena: formData.contrasena,
                    preguntaSeguridad: formData.pregunta,
                    respuestaPregunta: formData.respuesta
                })
            });

            if (!respuesta.ok) {
                const errorText = await respuesta.text();
                throw new Error(errorText);
            }

            setSuccess('¡Registro exitoso! Redirigiendo al login...');
            setTimeout(() => {
                navigate("/login");
            }, 2000);
        } catch (error) {
            setError(error.message);
        }
    };

    return (
        <div className="registrarse">
            <div className="registrarse__container">
                <div className="registrarse__logo">
                    <svg className="registrarse__logo-icon" fill="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                        <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z" />
                    </svg>
                    <h1 className="registrarse__title">EcoSólido</h1>
                    <p className="registrarse__subtitle">Crea tu cuenta para gestionar incidencias</p>
                </div>

                {error && (
                    <div className="registrarse__error">
                        {error}
                    </div>
                )}

                {success && (
                    <div className="registrarse__success">
                        {success}
                    </div>
                )}

                <form className="registrarse__form" onSubmit={handleSubmit}>
                    <div className="registrarse__row">
                        <div className="registrarse__field">
                            <label htmlFor="nombre">Nombre<span style={{ color: '#ff7a00' }}>*</span></label>
                            <input
                                type="text"
                                id="nombre"
                                name="nombre"
                                placeholder="Tu nombre"
                                value={formData.nombre}
                                onChange={handleChange}
                                required
                            />
                        </div>
                        <div className="registrarse__field">
                            <label htmlFor="apellido">Apellido<span style={{ color: '#ff7a00' }}>*</span></label>
                            <input
                                type="text"
                                id="apellido"
                                name="apellido"
                                placeholder="Tu apellido"
                                value={formData.apellido}
                                onChange={handleChange}
                                required
                            />
                        </div>
                    </div>

                    <div className="registrarse__field">
                        <label htmlFor="email">Correo electrónico<span style={{ color: '#ff7a00' }}>*</span></label>
                        <input
                            type="email"
                            id="email"
                            name="email"
                            placeholder="tu@email.com"
                            value={formData.email}
                            onChange={handleChange}
                            required
                        />
                    </div>

                    <div className="registrarse__field">
                        <label htmlFor="telefono">Teléfono<span style={{ color: '#ff7a00' }}>*</span></label>
                        <input
                            type="tel"
                            id="telefono"
                            name="telefono"
                            maxLength="9"
                            placeholder="Tu número de teléfono"
                            value={formData.telefono}
                            onChange={handleChange}
                            required
                        />
                    </div>
                    <div className="registrarse__field">
                        <label htmlFor="DNI">DNI<span style={{ color: '#ff7a00' }}>*</span></label>
                        <input
                            type="text"
                            id="DNI"
                            name="DNI"
                            maxLength="8"
                            placeholder="Establece el DNI"
                            value={formData.DNI}
                            onChange={handleChange}
                            required
                        />
                    </div>
                    <div className="registrarse__field">
                        <label htmlFor="nombreUsuario">Nombre de usuario<span style={{ color: '#ff7a00'}}>*</span></label>
                        <input
                            type="text"
                            id="nombreUsuario"
                            name="nombreUsuario"
                            placeholder="Elige un nombre de usuario"
                            value={formData.nombreUsuario}
                            onChange={handleChange}
                            required
                        />
                    </div>
                    <div className="registrarse__field">
                        <label htmlFor="pregunta">Pregunta de seguridad<span style={{ color: '#ff7a00' }}>*</span></label>
                        <input
                            type="text"
                            id="pregunta"
                            name="pregunta"
                            placeholder="Deben ser respondibles con 1 o 3 palabras como máximo"
                            value={formData.pregunta}
                            onChange={handleChange}
                            required
                        />
                    </div>
                    <div className="registrarse__field">
                        <label htmlFor="respuesta">Respuesta<span style={{ color: '#ff7a00' }}>*</span></label>
                        <input
                            type="text"
                            id="respuesta"
                            name="respuesta"
                            placeholder="Solo coloque la respuesta"
                            value={formData.respuesta}
                            onChange={handleChange}
                            required
                        />
                    </div>
                    {/*<div className="registrarse__field">
                        <label htmlFor="tipoUsuario">Tipo de usuario</label>
                        <select
                            id="tipoUsuario"
                            name="tipoUsuario"
                            value={formData.tipoUsuario}
                            onChange={handleChange}
                        >
                            <option value="ciudadano">Ciudadano</option>
                            <option value="tecnico">Técnico</option>
                            <option value="administrador">Administrador</option>
                        </select>
                    </div>*/}

                    <div className="registrarse__field">
                        <label htmlFor="contrasena">Contraseña<span style={{ color: '#ff7a00' }}>*</span></label>
                        <div className="registrarse_input_wrapper">
                            <input
                                type={verContra ? "text" : "password"}
                                id="contrasena"
                                name="contrasena"
                                placeholder="Mínimo 6 caracteres"
                                value={formData.contrasena}
                                onChange={handleChange}
                                required
                            />
                            <button
                                type="button"
                                className="registrarse_toogle_pass"
                                onClick={() => setVerContra(prev => !prev)}
                                aria-label={verContra ? "Ocultar contraseña" : "Ver contraseña"}
                            >
                                <span className="material-symbols-outlined">
                                    {verContra ? "visibility" : "visibility_off"}
                                </span>
                            </button>
                        </div>
                    </div>

                    <div className="registrarse__field">
                        <label htmlFor="confirmarContrasena">Confirmar contraseña<span style={{ color: '#ff7a00'}}>*</span></label>
                        <div className="registrarse_input_wrapper">
                            <input
                                type={verContraRepetida ? "text" : "password"}
                                id="confirmarContrasena"
                                name="confirmarContrasena"
                                placeholder="Repite tu contraseña"
                                value={formData.confirmarContrasena}
                                onChange={handleChange}
                                required
                            />
                            <button
                                type="button"
                                className="registrarse_toogle_pass"
                                onClick={() => setVerContraRepetida(prev => !prev)}
                                aria-label={verContra ? "Ocultar contraseña" : "Ver contraseña"}
                            >
                                <span className="material-symbols-outlined">
                                    {verContraRepetida ? "visibility" : "visibility_off"}
                                </span>
                            </button>
                        </div>

                    </div>
                    <span style={{ color: '#ff7a00'}}>*Campo Obligatorio</span>
                    <div className="registrarse__actions">
                        <button type="submit" className="registrarse__submit">
                            Crear Cuenta
                        </button>
                    </div>
                </form>

                <div className="registrarse__links">
                    <p>¿Ya tienes cuenta?</p>
                    <button
                        type="button"
                        className="registrarse__link"
                        onClick={() => navigate("/login")}
                    >
                        Inicia sesión aquí
                    </button>
                </div>
            </div>
        </div>
    )
}
