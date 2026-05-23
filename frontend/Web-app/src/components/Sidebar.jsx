import { IconEducacion, IconRegistro, IconSeguimiento } from './icons'
import './Sidebar.css'

const MENU_ITEMS = [
  { id: 'registro', label: 'Registro de Incidencias', icon: IconRegistro, active: true },
  { id: 'seguimiento', label: 'Seguimiento de incidencias', icon: IconSeguimiento, active: false },
  { id: 'educacion', label: 'Educación medio ambiental', icon: IconEducacion, active: false },
]

export default function Sidebar() {
  return (
    <aside className="sidebar">
      <nav aria-label="Menú principal">
        <ul className="sidebar__list">
          {MENU_ITEMS.map(({ id, label, icon: Icon, active }) => (
            <li key={id}>
              <button
                type="button"
                className={`sidebar__item${active ? ' sidebar__item--active' : ''}`}
                aria-current={active ? 'page' : undefined}
              >
                <Icon />
                <span>{label}</span>
              </button>
            </li>
          ))}
        </ul>
      </nav>
    </aside>
  )
}
