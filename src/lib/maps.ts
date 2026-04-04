/**
 * Abre Google Maps con una dirección específica
 */
export const abrirGoogleMaps = (direccion: string, localidad?: string) => {
  const direccionCompleta = localidad ? `${direccion}, ${localidad}` : direccion

  const direccionCodificada = encodeURIComponent(direccionCompleta)
  const googleMapsURL = `https://www.google.com/maps/search/?api=1&query=${direccionCodificada}`

  window.open(googleMapsURL, '_blank')
}

/**
 * Abre Google Maps con navegación turn-by-turn desde ubicación actual
 */
export const navegarADireccion = (direccion: string, localidad?: string) => {
  const direccionCompleta = localidad ? `${direccion}, ${localidad}` : direccion

  const direccionCodificada = encodeURIComponent(direccionCompleta)
  const navegacionURL = `https://www.google.com/maps/dir/?api=1&destination=${direccionCodificada}`

  window.open(navegacionURL, '_blank')
}

/**
 * Genera una URL de Google Maps para embed (si necesitas mostrar mapa embebido)
 */
export const generarURLEmbed = (direccion: string, localidad?: string) => {
  const direccionCompleta = localidad ? `${direccion}, ${localidad}` : direccion

  const direccionCodificada = encodeURIComponent(direccionCompleta)
  return `https://www.google.com/maps/embed/v1/place?key=YOUR_API_KEY&q=${direccionCodificada}`
}

/**
 * Valida si una dirección tiene los datos mínimos para navegación
 */
export const validarDireccion = (
  direccion?: string,
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  localidad?: string
): boolean => {
  return !!(direccion && direccion.trim().length > 0)
}
