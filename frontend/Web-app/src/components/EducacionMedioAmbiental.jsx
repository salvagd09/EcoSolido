import { useState } from 'react'
import './EducacionMedioAmbiental.css'

const ARTICULOS = [
  {
    id: 1,
    titulo: '¿Cómo reducir tu huella de carbono?',
    resumen: 'Descubre prácticas simples pero efectivas para disminuir tu impacto ambiental en el día a día.',
    categoria: 'Huella de Carbono',
    imagen: 'https://images.unsplash.com/photo-1532094349884-543bc11b234d?w=400&h=250&fit=crop',
    fecha: '2026-06-01'
  },
  {
    id: 2,
    titulo: 'Reciclaje: Guía completa para principiantes',
    resumen: 'Aprende a separar correctamente tus residuos y contribuye al cuidado del medio ambiente.',
    categoria: 'Reciclaje',
    imagen: 'https://images.unsplash.com/photo-1532996122724-e3c354a0b15b?w=400&h=250&fit=crop',
    fecha: '2026-05-28'
  },
  {
    id: 3,
    titulo: 'El impacto de los plásticos en los océanos',
    resumen: 'Conoce cómo los plásticos de un solo uso afectan la vida marina y qué puedes hacer al respecto.',
    categoria: 'Contaminación',
    imagen: 'https://images.unsplash.com/photo-1483729558449-99ef09a8c325?w=400&h=250&fit=crop',
    fecha: '2026-05-25'
  },
  {
    id: 4,
    titulo: 'Energías renovables: El futuro es hoy',
    resumen: 'Explora las diferentes fuentes de energía limpia y cómo están transformando nuestro mundo.',
    categoria: 'Energía',
    imagen: 'https://images.unsplash.com/photo-1508514177221-188b1cf16e9d?w=400&h=250&fit=crop',
    fecha: '2026-05-20'
  },
  {
    id: 5,
    titulo: 'Compostaje doméstico: Transforma tus residuos',
    resumen: 'Aprende a crear tu propio compost y reduce significativamente la basura que generas.',
    categoria: 'Compostaje',
    imagen: 'https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=400&h=250&fit=crop',
    fecha: '2026-05-15'
  },
  {
    id: 6,
    titulo: 'Movilidad sostenible: Alternativas ecológicas',
    resumen: 'Descubre opciones de transporte que reducen la contaminación y mejoran tu salud.',
    categoria: 'Movilidad',
    imagen: 'https://images.unsplash.com/photo-1558494949-ef010cbdcc31?w=400&h=250&fit=crop',
    fecha: '2026-05-10'
  }
]

const CATEGORIAS = ['Todas', 'Huella de Carbono', 'Reciclaje', 'Contaminación', 'Energía', 'Compostaje', 'Movilidad']

export default function EducacionMedioAmbiental() {
  const [categoriaActiva, setCategoriaActiva] = useState('Todas')
  const [articuloSeleccionado, setArticuloSeleccionado] = useState(null)

  const articulosFiltrados = categoriaActiva === 'Todas'
    ? ARTICULOS
    : ARTICULOS.filter(articulo => articulo.categoria === categoriaActiva)

  return (
    <main className="educacion">
      <div className="educacion__header">
        <h2 className="educacion__title">Educación Medio Ambiental</h2>
        <p className="educacion__subtitle">
          Aprende y comparte conocimientos para cuidar nuestro planeta
        </p>
      </div>

      <div className="educacion__categorias">
        {CATEGORIAS.map(categoria => (
          <button
            key={categoria}
            className={`educacion__categoria-btn ${categoriaActiva === categoria ? 'educacion__categoria-btn--active' : ''}`}
            onClick={() => setCategoriaActiva(categoria)}
          >
            {categoria}
          </button>
        ))}
      </div>

      {articuloSeleccionado ? (
        <article className="educacion__detalle">
          <button
            className="educacion__volver-btn"
            onClick={() => setArticuloSeleccionado(null)}
          >
            ← Volver a los artículos
          </button>
          <div className="educacion__detalle-contenido">
            <img
              src={articuloSeleccionado.imagen}
              alt={articuloSeleccionado.titulo}
              className="educacion__detalle-imagen"
            />
            <div className="educacion__detalle-info">
              <span className="educacion__detalle-categoria">
                {articuloSeleccionado.categoria}
              </span>
              <h3 className="educacion__detalle-titulo">
                {articuloSeleccionado.titulo}
              </h3>
              <p className="educacion__detalle-fecha">
                Publicado el {articuloSeleccionado.fecha}
              </p>
              <div className="educacion__detalle-cuerpo">
                <p>
                  {articuloSeleccionado.resumen}
                </p>
                <p>
                  Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor 
                  incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis 
                  nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.
                </p>
                <p>
                  Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore 
                  eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, 
                  sunt in culpa qui officia deserunt mollit anim id est laborum.
                </p>
              </div>
            </div>
          </div>
        </article>
      ) : (
        <div className="educacion__grid">
          {articulosFiltrados.map(articulo => (
            <article
              key={articulo.id}
              className="educacion__card"
              onClick={() => setArticuloSeleccionado(articulo)}
            >
              <div className="educacion__card-imagen-wrapper">
                <img
                  src={articulo.imagen}
                  alt={articulo.titulo}
                  className="educacion__card-imagen"
                />
                <span className="educacion__card-categoria">
                  {articulo.categoria}
                </span>
              </div>
              <div className="educacion__card-contenido">
                <h3 className="educacion__card-titulo">{articulo.titulo}</h3>
                <p className="educacion__card-resumen">{articulo.resumen}</p>
                <span className="educacion__card-fecha">{articulo.fecha}</span>
              </div>
            </article>
          ))}
        </div>
      )}

      {articulosFiltrados.length === 0 && !articuloSeleccionado && (
        <div className="educacion__vacio">
          <p>No hay artículos disponibles en esta categoría.</p>
        </div>
      )}
    </main>
  )
}