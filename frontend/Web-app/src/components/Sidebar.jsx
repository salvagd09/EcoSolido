import { useState } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import { IconRegistro, IconSeguimiento, IconEducacion, IconCerrarMenu, IconMenu } from './icons'
import './Sidebar.css'

const MENU_ITEMS = [
  { 
    id: 'registro', 
    label: 'Registro de Incidencias', 
    icon: IconRegistro, 
    path: '/registro',
    enabled: true 
  },
  { 
    id: 'seguimiento', 
    label: 'Seguimiento de Incidencias', 
    icon: IconSeguimiento, 
    path: '/seguimiento',
    enabled: true
  },
  { 
    id: 'educacion', 
    label: 'Educación Medio Ambiental', 
    icon: IconEducacion, 
    path: '/educacion',
    enabled: true
  },
]

export default function Sidebar({ isOpen, onClose }) {
  const location = useLocation()
  const navigate = useNavigate()
  const [isCollapsed, setIsCollapsed] = useState(false)

  const isActive = (path) => location.pathname === path

  const handleNavigation = (item) => {
    if (!item.enabled) {
      return
    }
    navigate(item.path)
    if (window.innerWidth <= 768) {
      onClose()
    }
  }

  const toggleCollapse = () => {
    setIsCollapsed(prev => !prev)
  }

  const sidebarClass = `sidebar${isOpen ? ' sidebar--open' : ''}${isCollapsed ? ' sidebar--collapsed' : ''}`

  return (
    <>
      {isOpen && <div className="sidebar__overlay" onClick={onClose} aria-hidden="true" />}
      
      <aside className={sidebarClass}>
        <div className="sidebar__header">
          <div className="sidebar__logo-container">
            <span className="sidebar__logo">Menú</span>
          </div>
          
          <button
            type="button"
            className="sidebar__collapse-btn"
            onClick={toggleCollapse}
            aria-label={isCollapsed ? 'Expandir menú' : 'Colapsar menú'}
            title={isCollapsed ? 'Expandir' : 'Colapsar'}
          >
            <IconMenu />
          </button>

          <button
            type="button"
            className="sidebar__close-btn"
            onClick={onClose}
            aria-label="Cerrar menú"
          >
            <IconCerrarMenu />
          </button>
        </div>

        <nav className="sidebar__nav" aria-label="Menú principal">
          <ul className="sidebar__list">
            {MENU_ITEMS.map(({ id, label, icon: Icon, path, enabled }) => {
              const active = isActive(path)
              return (
                <li key={id}>
                  <button
                    type="button"
                    className={`sidebar__item${active ? ' sidebar__item--active' : ''}`}
                    onClick={() => handleNavigation({ id, label, icon: Icon, path, enabled })}
                    aria-current={active ? 'page' : undefined}
                    title={isCollapsed ? label : undefined}
                  >
                    <span className="sidebar__item-icon">
                      <Icon />
                    </span>
                    <span className="sidebar__item-label">{label}</span>
                  </button>
                </li>
              )
            })}
          </ul>
        </nav>

        <div className="sidebar__footer">
          <span className="sidebar__footer-text">
            {isCollapsed ? '©' : '© 2026 EcoSólido'}
          </span>
        </div>
      </aside>
    </>
  )
}