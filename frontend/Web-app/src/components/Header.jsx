import { useState, useEffect } from 'react'
import { IconSalir, IconUsuario, IconSol, IconLuna, IconMenu } from './icons'
import './Header.css'
import CerrarSesionModal from './CerrarSesionModal'
import { useNavigate } from 'react-router-dom'
import logo from '../assets/LOGO ECOSOLIDO.png'

export default function Header({ onMenuClick }) {
  const [temaOscuro, setTemaOscuro] = useState(() => {
    const temaGuardado = localStorage.getItem('tema')
    return temaGuardado === 'oscuro'
  })
  const navigate = useNavigate()
  const nombreUsuario = localStorage.getItem("nombreUsuario") 
  const [showCerrarSModal, setShowCerrarSModal] = useState(false)

  useEffect(() => {
    const root = document.documentElement
    if (temaOscuro) {
      root.setAttribute('data-theme', 'dark')
      localStorage.setItem('tema', 'oscuro')
    } else {
      root.removeAttribute('data-theme')
      localStorage.setItem('tema', 'claro')
    }
  }, [temaOscuro])

  function toggleTema() {
    setTemaOscuro(prev => !prev)
  }

  function handleCerrarSesion() {
    setShowCerrarSModal(true)
  }

  function handleConfirmarCierre() {
    localStorage.removeItem('token')
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