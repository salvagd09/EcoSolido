import './BarraProgreso.css'
const puntosCategoria = [
    {
        puntosNecesarios: 10,
        insignia: 'Primer reporte'
    },
    {
        puntosNecesarios: 50,
        insignia: 'Reportero activo'
    },
    {
        puntosNecesarios: 100,
        insignia: 'Guardián del barrio'
    },
    {
        puntosNecesarios: 150,
        insignia: 'EcoHéroe'
    },
    {
        puntosNecesarios: 200,
        insignia: 'Embajador EcoSólido'
    },
]
export default function BarraProgreso({ puntos }) {
    const puntosNum = Number(puntos) 
    const maxPuntos = 200
    const nivelActual = [...puntosCategoria].reverse().find(nivel => puntos >= nivel.puntosNecesarios)
    const nivelSiguiente = puntosCategoria.find(nivel => puntos < nivel.puntosNecesarios)
    const puntosBase = nivelActual?.puntosNecesarios ?? 0
    const puntajeMaximo = nivelSiguiente?.puntosNecesarios ?? maxPuntos
    const progreso = Math.min(((puntos - puntosBase) / (puntajeMaximo - puntosBase)) * 100, 100)
    return (
        <>
            <div className="barraProgreso">
                <div className="barraProgreso__info">
                    <span className="barraProgreso__nivel">
                        Te encuentras en la insignia: {nivelActual ? `${nivelActual.insignia}` : 'Sin insignia'}
                    </span>

                </div>
                <div className="barraProgreso__contenedor">
                    <div
                        className="barraProgreso__relleno"
                        style={{ width: `${progreso}%` }}
                    />
                </div>
                <div className="barraProgreso__meta">
                    {puntosNum === 0 ? (
                        <p className="barraProgreso__sinContribuciones">
                            Aún no has realizado contribuciones. ¡Registra tu primera incidencia!
                        </p>
                    ):
                    nivelSiguiente ? (<>
                        <span className="barraProgreso__puntos">Actualmente tienes {puntos} puntos. Necesitas {puntajeMaximo - puntos} para llegar a ser: </span>
                        <span className="barraProgreso__sigInsignia">
                            <strong>{nivelSiguiente.insignia}</strong>
                        </span>
                    </>
                    ) : (
                        <span>🎉 ¡Has alcanzado el nivel máximo!</span>
                    )}
                </div>
            </div>

        </>
    )
}