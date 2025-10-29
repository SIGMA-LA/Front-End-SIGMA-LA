export async function fetchWithErrorHandling(
  url: string,
  options: RequestInit = {}
) {
  try {
    const res = await fetch(url, {
      ...options,
      signal: (AbortSignal as any).timeout
        ? (AbortSignal as any).timeout(10000)
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
    if (err?.cause?.code === 'ECONNREFUSED') throw new Error('ECONNREFUSED')
    throw err
  }
}
