export const MENSAJE_FOTOS_NO_VISIBLES =
  'Lo siento, no pude ver muy bien las fotos por lo cual no puedo describirlas. ¿Podrías volver a pasarlas o cambiar de fotos?'

export function esRespuestaFotosNoVisibles(texto) {
  if (!texto) return false

  const t = texto.trim().toLowerCase()
  const esperado = MENSAJE_FOTOS_NO_VISIBLES.toLowerCase()

  return t === esperado || t.startsWith('lo siento, no pude ver muy bien')
}
