import { useState } from 'react'
import './SeguimientoIncidencias.css'

// Datos mockeados para demostración
const INCIDENCIAS_MOCK = [
  {
    id: 'INC-001',
    categoria: 'Acumulación y falta de recojo',
    fecha: '2026-06-01',
    estado: 'Pendiente',
    descripcion: 'Acumulación de residuos en la esquina de Av. Principal con Calle 5',
    ubicacion: 'Av. Principal con Calle 5'
  },
  {
    id: 'INC-002',
    categoria: 'Basura en vía pública',
    fecha: '2026-06-02',
    estado: 'En Proceso',
    descripcion: 'Residuos sólidos abandonados frente al mercado municipal',
    ubicacion: 'Frente al mercado municipal'
  },
  {
    id: 'INC-003',
    categoria: 'Contenedor dañado o lleno',
    fecha: '2026-06-03',
    estado: 'Resuelto',
    descripcion: 'Contenedor de basura dañado en el parque central',
    ubicacion: 'Parque central'
  },
  {
    id: 'INC-004',
    categoria: 'Escombros o materiales de construcción',
    fecha: '2026-06-03',
    estado: 'Pendiente',
    descripcion: 'Escombros de construcción abandonados en la vía pública',
    ubicacion: 'Calle Los Andes 123'
  }
]

const ESTADOS = {
  Pendiente: 'pending',
  'En Proceso': 'in-progress',
  Resuelto: 'resolved'
}

const CLASES_ESTADO = {
  pending: 'estado--pending',
  'in-progress': 'estado--progress',
  resolved: 'estado--resolved'
}

export default function SeguimientoIncidencias() {
  const [incidencias, setIncidencias] = useState(INCIDENCIAS_MOCK)
  const [filtroEstado, setFiltroEstado] = useState('todos')
  const [busqueda, setBusqueda] = useState('')

  const incidenciasFiltradas = incidencias.filter(incidencia => {
    const coincideEstado = filtroEstado === 'todos' || 
      ESTADOS[incidencia.estado] === filtroEstado
    const coincideBusqueda = incidencia.id.toLowerCase().includes(busqueda.toLowerCase()) ||
      incidencia.categoria.toLowerCase().includes(busqueda.toLowerCase()) ||
      incidencia.ubicacion.toLowerCase().includes(busqueda.toLowerCase())
    return coincideEstado && coincideBusqueda
  })

  return (
    <main className="seguimiento">
      <h2 className="seguimiento__title">Seguimiento de Incidencias</h2>
      
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
          <table className="seguimiento__tabla">
            <thead>
              <tr>
                <th>ID</th>
                <th>Categoría</th>
                <th>Ubicación</th>
                <th>Fecha</th>
                <th>Estado</th>
              </tr>
            </thead>
            <tbody>
              {incidenciasFiltradas.map(incidencia => (
                <tr key={incidencia.id} className="seguimiento__fila">
                  <td className="seguimiento__id">{incidencia.id}</td>
                  <td className="seguimiento__categoria">{incidencia.categoria}</td>
                  <td className="seguimiento__ubicacion">{incidencia.ubicacion}</td>
                  <td className="seguimiento__fecha">{incidencia.fecha}</td>
                  <td className={`seguimiento__estado estado--${CLASES_ESTADO[ESTADOS[incidencia.estado]]}`}>
                    {incidencia.estado}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </main>
  )
}