import { useState, useMemo,useEffect } from 'react'
import './SeguimientoIncidencias.css'

// Iconos SVG inline
const IconTotal = () => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M19 3H5C3.9 3 3 3.9 3 5V19C3 20.1 3.9 21 5 21H19C20.1 21 21 20.1 21 19V5C21 3.9 20.1 3 19 3ZM19 19H5V5H19V19Z" fill="currentColor"/>
    <path d="M7 12H9V17H7V12ZM11 7H13V17H11V7ZM15 10H17V17H15V10Z" fill="currentColor"/>
  </svg>
)

const IconResueltas = () => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M12 2C6.48 2 2 6.48 2 12C2 17.52 6.48 22 12 22C17.52 22 22 17.52 22 12C22 6.48 17.52 2 12 2ZM10 17L5 12L6.41 10.59L10 14.17L17.59 6.58L19 8L10 17Z" fill="currentColor"/>
  </svg>
)

const IconProceso = () => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M12 2C6.48 2 2 6.48 2 12C2 17.52 6.48 22 12 22C17.52 22 22 17.52 22 12C22 6.48 17.52 2 12 2ZM12 20C7.59 20 4 16.41 4 12C4 7.59 7.59 4 12 4C16.41 4 20 7.59 20 12C20 16.41 16.41 20 12 20Z" fill="currentColor"/>
    <path d="M12 6C8.69 6 6 8.69 6 12C6 15.31 8.69 18 12 18C15.31 18 18 15.31 18 12C18 8.69 15.31 6 12 6ZM12 16C9.79 16 8 14.21 8 12C8 9.79 9.79 8 12 8C14.21 8 16 9.79 16 12C16 14.21 14.21 16 12 16Z" fill="currentColor"/>
    <path d="M12 10C10.9 10 10 10.9 10 12C10 13.1 10.9 14 12 14C13.1 14 14 13.1 14 12C14 10.9 13.1 10 12 10Z" fill="currentColor"/>
  </svg>
)

const IconPendientes = () => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M1 21H23L12 2L1 21ZM13 18H11V16H13V18ZM13 14H11V10H13V14Z" fill="currentColor"/>
  </svg>
)


const ESTADOS = {
  PENDIENTE: 'pending',
  EN_PROCESO: 'in-progress',
  RESUELTO: 'resolved'
}

const CLASES_ESTADO = {
  pending: 'estado--pending',
  'in-progress': 'estado--progress',
  resolved: 'estado--resolved'
}

export default function SeguimientoIncidencias({ incidencias: propsIncidencias }) {
  // Usar las incidencias pasadas como prop (vacío si no hay ninguna)
  const [filtroEstado, setFiltroEstado] = useState('todos')
  const [busqueda, setBusqueda] = useState('')
  const [metricas, setMetricas] = useState({ total: 0, resueltas: 0, enProceso: 0, pendientes: 0 })
  const [cargandoMetricas, setCargandoMetricas] = useState(true)
  const [incidencias, setIncidencias] = useState([])
  useEffect(() => {
    async function obtenerMetricas() {
      try {
        const token = localStorage.getItem('token')
        const response = await fetch('http://localhost:8080/incidencias/metricas', {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        })
        const data = await response.json()
        setMetricas(data)
      } catch (error) {
        console.error('Error al obtener métricas:', error)
      } finally {
        setCargandoMetricas(false)
      }
    }
    obtenerMetricas()
  }, [])
  useEffect(() => {
    async function mostrarIncidencias() {
        try {
            const token = localStorage.getItem('token')
            const response = await fetch('http://localhost:8080/incidencias/seguir', {
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            })
            const data2 = await response.json()
            setIncidencias(data2)
        } catch (error) {
            console.error('Error al obtener incidencias', error)
        }
    }
    mostrarIncidencias()
}, [])
  // Verificar si no hay incidencias
  const sinIncidencias = metricas.total === 0
  const formatearFecha = (fechaString) => {
    if (!fechaString) return '';
    const fecha = new Date(fechaString);
    
    return new Intl.DateTimeFormat('es-ES', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric'
    }).format(fecha).replace(/\//g, '-');
  };
  const incidenciasFiltradas = incidencias.filter(incidencia => {
    const coincideEstado = filtroEstado === 'todos' || 
        ESTADOS[incidencia.estado] === filtroEstado
    const coincideBusqueda = 
        incidencia.idIncidencia.toString().toLowerCase().includes(busqueda.toLowerCase()) ||
        incidencia.categoria.toLowerCase().includes(busqueda.toLowerCase()) ||
        (incidencia.direccionTexto?.toLowerCase() ?? '').includes(busqueda.toLowerCase())
    return coincideEstado && coincideBusqueda
  })
  return (
    <main className="seguimiento">
      <h2 className="seguimiento__title">Seguimiento de Incidencias</h2>
      
      {/* Panel de Métricas */}
      <div className="metricas-panel">
        <div className="metrica-card metrica-card--total">
          <div className="metrica-card__icon">
            <IconTotal />
          </div>
          <div className="metrica-card__content">
            <span className="metrica-card__numero">
              {cargandoMetricas ? '...' : metricas.total}
            </span>
            <span className="metrica-card__label">Total Reportadas</span>
          </div>
        </div>
        
        <div className="metrica-card metrica-card--resueltas">
          <div className="metrica-card__icon">
            <IconResueltas />
          </div>
          <div className="metrica-card__content">
            <span className="metrica-card__numero">
              {cargandoMetricas ? '...' : metricas.resueltas}
            </span>
            <span className="metrica-card__label">Resueltas</span>
          </div>
        </div>
        
        <div className="metrica-card metrica-card--proceso">
          <div className="metrica-card__icon">
            <IconProceso />
          </div>
          <div className="metrica-card__content">
            <span className="metrica-card__numero">
              {cargandoMetricas ? '...' : metricas.enProceso}
            </span>
            <span className="metrica-card__label">En Proceso</span>
          </div>
        </div>
        
        <div className="metrica-card metrica-card--pendientes">
          <div className="metrica-card__icon">
            <IconPendientes />
          </div>
          <div className="metrica-card__content">
            <span className="metrica-card__numero">
              {cargandoMetricas ? '...' : metricas.pendientes}
            </span>
            <span className="metrica-card__label">Pendientes</span>
          </div>
        </div>
      </div>

      {!cargandoMetricas && sinIncidencias && (
        <div className="sin-incidencias-mensaje">
          <p>¡Empieza a reportar incidencias y mide tu impacto!</p>
        </div>
      )}
      
      <div className="seguimiento__controls">
        <div className="seguimiento__search">
          <input
            type="text"
            placeholder="Buscar por ID, categoría o ubicación..."
            value={busqueda}
            onChange={(e) => setBusqueda(e.target.value)}
            className="seguimiento__search-input"
          />
        </div>
        
        <div className="seguimiento__filtros">
          <button
            className={`seguimiento__filtro-btn ${filtroEstado === 'todos' ? 'seguimiento__filtro-btn--active' : ''}`}
            onClick={() => setFiltroEstado('todos')}
          >
            Todos
          </button>
          <button
            className={`seguimiento__filtro-btn ${filtroEstado === 'pending' ? 'seguimiento__filtro-btn--active' : ''}`}
            onClick={() => setFiltroEstado('pending')}
          >
            Pendientes
          </button>
          <button
            className={`seguimiento__filtro-btn ${filtroEstado === 'in-progress' ? 'seguimiento__filtro-btn--active' : ''}`}
            onClick={() => setFiltroEstado('in-progress')}
          >
            En Proceso
          </button>
          <button
            className={`seguimiento__filtro-btn ${filtroEstado === 'resolved' ? 'seguimiento__filtro-btn--active' : ''}`}
            onClick={() => setFiltroEstado('resolved')}
          >
            Resueltos
          </button>
        </div>
      </div>

      <div className="seguimiento__lista">
        {incidenciasFiltradas.length === 0 ? (
          <div className="seguimiento__vacio">
            <p>No se encontraron incidencias que coincidan con los filtros.</p>
          </div>
        ) : (
          <div className="seguimiento__tarjetas">
            {incidenciasFiltradas.map(incidencia => (
              <div key={incidencia.idIncidencia} className="incidencia-tarjeta">
                <div className="incidencia-tarjeta__header">
                  <h3 className="incidencia-tarjeta__titulo">{incidencia.titulo}</h3>
                  <span className={`incidencia-tarjeta__estado estado--${CLASES_ESTADO[ESTADOS[incidencia.estado]]}`}>
                    {incidencia.estado}
                  </span>
                </div>
                <p className="incidencia-tarjeta__fecha">📅{formatearFecha(incidencia.fecha)} </p>
                <p className="incidencia-tarjeta__descripcion">{incidencia.descripcion}</p>
                <p className="incidencia-tarjeta__ubicacion">📍 {!incidencia.direccionTexto ? "No se sabe" : incidencia.direccionTexto}</p>
                {incidencia.urlsImagenes && incidencia.urlsImagenes.length > 0 && (
                <img 
                      src={incidencia.urlsImagenes[0]} 
                      alt={incidencia.titulo}
                      className="incidencia-tarjeta__imagen"
                  />
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </main>
  )
}