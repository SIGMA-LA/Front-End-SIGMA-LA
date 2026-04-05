export async function fetchWithErrorHandling<T = unknown>(
  url: string,
  options: RequestInit & { timeout?: number } = {}
): Promise<Response & { json(): Promise<T> }> {
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
      let errorMsg = `Error HTTP ${res.status}`
      try {
        const errorData = (await res.json()) as { 
          message?: string; 
          error?: string; 
          errorCode?: string; 
          status?: string;
          details?: string;
        }
        
        // El backend ahora centraliza las traducciones al español mediante ERROR_MAP.
        // Priorizamos el 'message' que ya viene localizado.
        if (errorData.message) {
          errorMsg = errorData.message
        } else if (errorData.error) {
          errorMsg = errorData.error
        }
        
        // Si hay una lista de detalles (como conflictos de agenda), los agregamos.
        if (Array.isArray(errorData.details)) {
          // Si los detalles son un array de strings o objetos con mensaje, los unimos.
          const detailsStr = errorData.details
            .map((d: unknown) => {
              if (typeof d === 'string') return d
              if (d && typeof d === 'object' && 'message' in d) return String(d.message)
              return JSON.stringify(d)
            })
            .join('\n')
          if (detailsStr) {
            errorMsg += `:\n${detailsStr}`
          }
        }
      } catch {
        if (res.status === 401) errorMsg = 'Sesión expirada o no autorizada'
        if (res.status === 404) errorMsg = 'Recurso no encontrado'
      }
      throw new Error(errorMsg)
    }

    // Intercept .json() to support standardized backend responses { status: 'success', data: ... }
    const originalJson = res.json.bind(res)
    res.json = async <R = unknown>() => {
      const json = (await originalJson()) as { 
        status: string; 
        data: R; 
        message?: string 
      }
      if (json && json.status === 'success' && json.data !== undefined) {
        return json.data
      }
      return json as unknown as R
    }

    return res
  } catch (err: unknown) {
    if (err instanceof Error) {
      if (err.name === 'AbortError') throw new Error('Tiempo de espera agotado')
      
      // Handle network errors (ECONNREFUSED)
      const cause = err.cause as { code?: string } | undefined
      if (cause?.code === 'ECONNREFUSED') {
        throw new Error(
          'No se puede conectar al servidor backend. Verifica que esté corriendo.'
        )
      }
      throw err
    }
    throw new Error('Ha ocurrido un error inesperado')
  }
}
