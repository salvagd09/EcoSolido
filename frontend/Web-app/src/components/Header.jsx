import { IconSalir, IconUsuario } from './icons'
import './Header.css'

export default function Header() {
  return (
    <header className="header">
      <h1 className="header__logo">EcoSólido</h1>
      <div className="header__actions">
        <button type="button" className="header__icon-btn" aria-label="Perfil de usuario">
          <IconUsuario />
        </button>
        <button type="button" className="header__icon-btn" aria-label="Cerrar sesión">
          <IconSalir />
        </button>
      </div>
    </header>
  )
}
