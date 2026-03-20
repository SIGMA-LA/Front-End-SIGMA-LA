export async function fetchWithErrorHandling(
  url: string,
  options: RequestInit & { timeout?: number } = {}
) {
  const { timeout = 10000, ...fetchOptions } = options
  const controller = new AbortController()
  const timeoutId = setTimeout(() => controller.abort(), timeout)
  
  try {
    const res = await fetch(url, {
      ...fetchOptions,
      signal: controller.signal,
    })
    clearTimeout(timeoutId)

    if (!res.ok) {
      if (res.status === 401) throw new Error('Unauthorized')
      if (res.status === 404) throw new Error('Not found')
      let errorMsg = `HTTP ${res.status}`
      try {
        const errorData = await res.json()
        errorMsg = errorData.message || errorData.error || errorMsg
      } catch (_) {
        // Ignore parsing errors for non-JSON responses
      }
      throw new Error(errorMsg)
    }
    return res
  } catch (err: unknown) {
    if (err instanceof Error) {
      if (err.name === 'AbortError') throw new Error('Request timeout')
      // Check for ECONNREFUSED, assuming err.cause might be an object with a code property
      if (typeof err.cause === 'object' && err.cause !== null && 'code' in err.cause && err.cause.code === 'ECONNREFUSED') {
        throw new Error(
          'No se puede conectar al servidor backend. Verifica que esté corriendo en ' +
            (url.startsWith('http') ? new URL(url).origin : 'la URL configurada')
        )
      }
      throw err // Re-throw the error if it's an Error instance but not specifically handled
    }
    // If err is not an instance of Error, throw a generic error
    throw new Error('Ha ocurrido un error inesperado al realizar la petición')
  }
}
