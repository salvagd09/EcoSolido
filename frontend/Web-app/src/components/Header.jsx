import { useState, useEffect } from 'react'
import { IconSalir, IconUsuario, IconSol, IconLuna, IconMenu } from './icons'
import './Header.css'
import CerrarSesionModal from './CerrarSesionModal'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../hooks/useAuth'
import logo from '../assets/LOGO ECOSOLIDO.png'
import { obtenerPuntosUsuario } from '../services/incidenciasApi'
const obtenerTemaInicial = () => {
    const temaGuardado = localStorage.getItem('theme');
    if (temaGuardado) {
      return temaGuardado === 'dark';
    }
    // Si no hay tema guardado, detecta si el sistema operativo del usuario ya usa modo oscuro
    return window.matchMedia('(prefers-color-scheme: dark)').matches;
};
export default function Header({ onMenuClick,onLogout }) {
  const [temaOscuro, setTemaOscuro] = useState(() => {
    obtenerTemaInicial()
  })
  const navigate = useNavigate()
  const [showCerrarSModal, setShowCerrarSModal] = useState(false)
  const { logout, user } = useAuth();
  const nombreUsuario = user?.nombreUsuario || localStorage.getItem("nombreUsuario")
  const [puntos, setPuntos] = useState(0)
  useEffect(() => {
    const root = document.documentElement
    if (temaOscuro) {
        root.setAttribute('data-theme', 'dark')
        localStorage.setItem('theme', 'dark')
    } else {
        root.removeAttribute('data-theme')
        localStorage.setItem('theme', 'light')
    }
  }, [temaOscuro])
  useEffect(() => {
    async function cargarPuntos() {
        try {
            const resultado = await obtenerPuntosUsuario()
            setPuntos(resultado)
            localStorage.setItem('puntos', resultado)
        } catch (error) {
            console.error('Error al obtener puntos:', error)
        }
    }
    cargarPuntos()
  }, [])
  function toggleTema() {
    setTemaOscuro(prev => !prev)
  }

  function handleCerrarSesion() {
    setShowCerrarSModal(true)
  }

  function handleConfirmarCierre() {
    logout();
    onLogout();
    navigate('/login', { replace: true })
  }

  return (
    <header className="header">
      <button
        type="button"
        className="header__menu-btn"
        onClick={onMenuClick}
        aria-label="Abrir menú"
        title="Menú"
      >
        <IconMenu />
      </button>
      <div className="header__logo-container">
        <img src={logo} alt="Logo" className="header__logo-img" />
        <h1 className="header__logo">EcoSólido</h1>
      </div>
      <div className="header__actions">
        <button
          type="button"
          className="header__icon-btn"
          onClick={toggleTema}
          aria-label={temaOscuro ? 'Cambiar a modo claro' : 'Cambiar a modo oscuro'}
          title={temaOscuro ? 'Modo claro' : 'Modo oscuro'}
        >
          {temaOscuro ? <IconSol /> : <IconLuna />}
        </button>
        <button type="button" className="header__icon-btn" aria-label="Perfil de usuario">
          <IconUsuario />
          <span className="header__username">{nombreUsuario}</span>
          <span className="header__points">⭐ {puntos} pts</span>
        </button>
        <button
          type="button"
          className="header__icon-btn"
          aria-label="Cerrar sesión"
          onClick={handleCerrarSesion}
        >
          <IconSalir />
        </button>
        {showCerrarSModal && (
          <CerrarSesionModal
            onConfirm={handleConfirmarCierre}
            onCancel={() => setShowCerrarSModal(false)}
          />
        )}
      </div>
    </header>
  )
}
