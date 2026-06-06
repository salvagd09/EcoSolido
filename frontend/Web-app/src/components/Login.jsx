import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
export default function Login() {
    const [nombreUs, setNombreUs] = useState("")
    const [contra, setContra] = useState("")
    const navigate = useNavigate();
    const [error, setError] = useState(null);
    const handleSubmit = async (e) => {
        e.preventDefault()
        try {
            const respuesta = await fetch("http://localhost:8080/usuario/autenticar", {
                method: "POST",
                headers: { 'Content-Type': 'application/json' },  // ← corregido
                body: JSON.stringify({
                    nombreUsuario: nombreUs,
                    contrasena: contra
                })
            });

            if (!respuesta.ok) {
                const error = await respuesta.text();
                throw new Error(error);
            }
            const data = await respuesta.json();
            // Guarda el token y redirige
            localStorage.setItem("token", data.token);
            navigate("/registro");
        } catch (error) {
            setError(error.message);  // ← muestra el error al usuario
        }
    }
    return (
        <>
            <h1>Área de Login</h1>
            <form onSubmit={handleSubmit}>
                <label htmlFor="username" >Ingresa tu nombre de usuario</label>
                <input type="text" id="username" value={nombreUs} onChange={(e) => {setNombreUs(e.target.value)}}/>
                <label htmlFor="contrasena">Ingresa tu contraseña</label>
                <input type="password" id="contrasena" value={contra} onChange={(e) => setContra(e.target.value)} />
               <button type="submit" className="btn-Registrar">Autenticar</button>
            </form>
            <div>
                <p>¿Aún no tienes cuenta?</p>
                <button type="button" onClick={() => navigate("/registrarse")}>
                    Registrate aquí
                </button>
            </div>
            <div>
                <p>¿Olvidaste tu contraseña?</p>
                <button type="button" onClick={()=>navigate("/restablecer")}>
                    Restablecer Contraseña
                </button>
            </div>
        </>
    )
}
