export async function fetchWithErrorHandling(
  url: string,
  options: RequestInit & { timeout?: number } = {}
) {
  const { timeout = 10000, ...fetchOptions } = options
  
  try {
    const res = await fetch(url, {
      ...fetchOptions,
      signal: (AbortSignal as any).timeout
        ? (AbortSignal as any).timeout(timeout)
        : undefined,
    })
    if (!res.ok) {
      if (res.status === 401) throw new Error('Unauthorized')
      if (res.status === 404) throw new Error('Not found')
      throw new Error(`HTTP ${res.status}`)
    }
    return res
  } catch (err: any) {
    if (err?.name === 'AbortError') throw new Error('Request timeout')
    if (err?.cause?.code === 'ECONNREFUSED') {
      throw new Error(
        'No se puede conectar al servidor backend. Verifica que esté corriendo en ' +
          (url.startsWith('http') ? new URL(url).origin : 'la URL configurada')
      )
    }
    throw err
  }
}
