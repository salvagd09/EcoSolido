import { useState, useMemo,useEffect } from 'react'
import './SeguimientoIncidencias.css'


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

export default function ManejarIncidencias({ incidencias: propsIncidencias }) {
  const [filtroEstado, setFiltroEstado] = useState('todos')
  const [busqueda, setBusqueda] = useState('')
  const INCIDENCIAS_FALSAS = []
  const [incidencias, setIncidencias] = useState(INCIDENCIAS_FALSAS)
  useEffect(() => {
    async function mostrarIncidencias() {
        try {
            const token = localStorage.getItem('token')
            const response = await fetch('http://localhost:8080/incidencias/mostrarT', {
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            })
            const data2 = await response.json()
            setIncidencias(data2)
        } catch (error) {
            console.error('Error al obtener incidencias', error)
            setIncidencias(INCIDENCIAS_FALSAS)
        }
    }
    mostrarIncidencias()
}, [])
  
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
    const fechaFormateada = formatearFecha(incidencia.fecha).toLowerCase();
    const coincideBusqueda = 
        fechaFormateada.includes(busqueda.toLowerCase()) ||
        incidencia.titulo.toLowerCase().includes(busqueda.toLowerCase()) ||
        (incidencia.direccionTexto?.toLowerCase() ?? '').includes(busqueda.toLowerCase())
    return coincideEstado && coincideBusqueda
  })
  return (
    <main className="seguimiento">
      <h2 className="seguimiento__title">Seguimiento de Incidencias</h2>
      
      <div className="seguimiento__controls">
        <div className="seguimiento__search">
          <input
            type="text"
            placeholder="Buscar por fecha, titulo o ubicacion..."
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
                <p className="incidencia-tarjeta__fecha">Fecha: {formatearFecha(incidencia.fecha)} </p>
                <p className="incidencia-tarjeta__descripcion">{incidencia.descripcion}</p>
                <p className="incidencia-tarjeta__ubicacion">Ubicación: {!incidencia.direccionTexto ? "No se sabe" : incidencia.direccionTexto}</p>
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
