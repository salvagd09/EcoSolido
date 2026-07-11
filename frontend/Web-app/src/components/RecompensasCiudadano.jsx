import { useEffect, useState } from 'react'
import { obtenerInsigniasUsuario} from '../services/incidenciasApi'
import primerInsignia from '../assets/PRIMER INSIGNIA.png'
import segundaInsignia from '../assets/SEGUNDA INSIGNIA.png'
import tercerInsignia from '../assets/TERCER INSIGNIA.png'
import cuartaInsignia from '../assets/CUARTA INSIGNIA.png'
import quintaInsignia from '../assets/QUINTA INSIGNIA.png'
import './RecompensasCiudadano.css'
import BarraProgreso from './BarraProgreso'

const IMAGENES_INSIGNIAS = {
  1: primerInsignia,
  2: segundaInsignia,
  3: tercerInsignia,
  4: cuartaInsignia,
  5: quintaInsignia
}

const MOCK_INSIGNIAS = [
  {
    idInsignia: 1,
    nombre: 'Primer reporte',
    descripcion: '¡Felicidades! Has registrado tu primera incidencia y comenzado a transformar tu comunidad.',
    requisitoIncidencias: 1,
    recompensa: 'Bono de S/20 en tu billetera digital para canjear en mercados locales.',
    desbloqueada: false,
    fechaDesbloqueo: null
  },
  {
    idInsignia: 2,
    nombre: 'Reportero activo',
    descripcion: 'Has registrado 5 incidencias. Tu compromiso con el medio ambiente es notable.',
    requisitoIncidencias: 5,
    recompensa: 'Bono de S/50 en tu billetera digital + recarga de 10 GB móviles.',
    desbloqueada: false,
    fechaDesbloqueo: null
  },
  {
    idInsignia: 3,
    nombre: 'Guardián del barrio',
    descripcion: 'Has registrado 10 incidencias. Eres un referente de cuidado ambiental en tu zona.',
    requisitoIncidencias: 10,
    recompensa: 'Vale de S/100 en canasta familiar + reconocimiento público en redes sociales.',
    desbloqueada: false,
    fechaDesbloqueo: null
  },
  {
    idInsignia: 4,
    nombre: 'EcoHéroe',
    descripcion: 'Has registrado 15 incidencias. Tu dedicación es inspiradora para toda la comunidad.',
    requisitoIncidencias: 15,
    recompensa: 'Vale de S/200 en canasta familiar + kit de productos ecológicos para el hogar.',
    desbloqueada: false,
    fechaDesbloqueo: null
  },
  {
    idInsignia: 5,
    nombre: 'Embajador EcoSólido',
    descripcion: 'Has registrado 20 incidencias. Eres un embajador del cambio ambiental.',
    requisitoIncidencias: 20,
    recompensa: 'Vale de S/500 en canasta familiar + kit EcoSólido + certificado de Embajador Ambiental.',
    desbloqueada: false,
    fechaDesbloqueo: null
  }
]
export default function RecompensasCiudadano() {
  const [insignias, setInsignias] = useState([])
  const [cargando, setCargando] = useState(true)
  const [error, setError] = useState('')
  const valor=localStorage.getItem('puntos')
  useEffect(() => {
    async function cargarInsignias() {
      try {
        // Usa el backend real para reflejar las insignias desbloqueadas
        const data = await obtenerInsigniasUsuario()
        setInsignias(data)
      } catch (err) {
        // Fallback a datos mock si el backend no está disponible
        console.warn('No se pudo conectar con el backend, usando datos mock:', err.message)
        setInsignias(MOCK_INSIGNIAS)
      } finally {
        setCargando(false)
      }
    }
    cargarInsignias()
  }, [])

  const desbloqueadas = insignias.filter(i => i.desbloqueada)
  const pendientes = insignias.filter(i => !i.desbloqueada)
  return (
    <main className="recompensas">
      <div className="recompensas__header">
        <h2 className="recompensas__title">Área de Recompensas</h2>
        <p className="recompensas__subtitle">
          Esta es el área en la cuál vas a poder ver tus insignias y los premios que mereces por obtener cada 1.
        </p>
      </div>

      {cargando && <p className="recompensas__estado">Cargando insignias...</p>}
      {error && <p className="recompensas__estado recompensas__estado--error">{error}</p>}

      {!cargando && !error && (
        <>
          <section className="recompensas__seccion">
              <h3 className="recompensas__seccion-title">
                Mis puntos
              </h3>
              <p className="recompensas_seccion_texto">
                Aquí vas a poder cuanto puntos tienes y cuánto es tu progreso para obtener la siguiente insignia
              </p>
              <BarraProgreso 
              puntos={valor}
              />
            <h3 className="recompensas__seccion-title">
              🏅 Insignias desbloqueadas ({desbloqueadas.length})
            </h3>
            {desbloqueadas.length === 0 ? (
              <p className="recompensas__vacio">
                Aún no has desbloqueado insignias. Registra incidencias para comenzar a ganar.
              </p>
            ) : (
              <div className="recompensas__grid">
                {desbloqueadas.map(insignia => (
                  <article key={insignia.idInsignia} className="recompensa-card recompensa-card--desbloqueada">
                    <h4 className="recompensa-card__nombre">{insignia.nombre}</h4>
                    <img
                      src={IMAGENES_INSIGNIAS[insignia.idInsignia]}
                      alt={insignia.nombre}
                      className="recompensa-card__imagen"
                    />
                    <p className="recompensa-card__descripcion">{insignia.descripcion}</p>
                    <div className="recompensa-card__recompensa">
                      <span className="recompensa-card__recompensa-label">Recompensa</span>
                      <span className="recompensa-card__recompensa-texto">{insignia.recompensa}</span>
                    </div>
                  </article>
                ))}
              </div>
            )}
          </section>

          <section className="recompensas__seccion">
            <h3 className="recompensas__seccion-title">
              🔒 Insignias pendientes ({pendientes.length})
            </h3>
            {pendientes.length === 0 ? (
              <p className="recompensas__vacio">¡Felicidades! Has desbloqueado todas las insignias disponibles.</p>
            ) : (
              <div className="recompensas__grid">
                {pendientes.map(insignia => (
                  <article key={insignia.idInsignia} className="recompensa-card recompensa-card--bloqueada">
                    <h4 className="recompensa-card__nombre">{insignia.nombre}</h4>
                    <img
                      src={IMAGENES_INSIGNIAS[insignia.idInsignia]}
                      alt={insignia.nombre}
                      className="recompensa-card__imagen recompensa-card__imagen--bloqueada"
                    />
                    <p className="recompensa-card__requisito">
                      Registra <strong>{insignia.requisitoIncidencias}</strong> incidencias para desbloquear esta insignia.
                    </p>
                    <div className="recompensa-card__recompensa">
                      <span className="recompensa-card__recompensa-label">Recompensa</span>
                      <span className="recompensa-card__recompensa-texto">{insignia.recompensa}</span>
                    </div>
                  </article>
                ))}
              </div>
            )}
          </section>
        </>
      )}
    </main>
  )
}
