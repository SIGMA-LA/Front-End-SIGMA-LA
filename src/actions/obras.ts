'use server'

import { Obra } from '@/types'
import { getAccessToken } from './auth'
import { revalidatePath } from 'next/cache'

const API_BASE = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000/api'
const baseUrl = API_BASE.endsWith('/obras') ? API_BASE : `${API_BASE}/obras`

async function fetchWithErrorHandling(url: string, options: RequestInit) {
  try {
    const res = await fetch(url, {
      ...options,
      signal: AbortSignal.timeout(10000),
    })
    if (!res.ok) {
      if (res.status === 401) throw new Error('Token expirado')
      if (res.status === 404) throw new Error('Recurso no encontrado')
      throw new Error(`Error HTTP: ${res.status}`)
    }
    return res
  } catch (err: any) {
    if (err?.name === 'AbortError') throw new Error('Timeout en la petición')
    if (err?.cause?.code === 'ECONNREFUSED')
      throw new Error('No se pudo conectar con el servidor')
    throw err
  }
}

/* Buscar obras por texto (GET /obras/buscar?{texto}) */
export async function obtenerObras(filtro?: string): Promise<Obra[]> {
  try {
    const token = await getAccessToken()
    let url = baseUrl
    if (filtro && filtro.trim().length > 0) {
      url = `${baseUrl}/buscar?${encodeURIComponent(filtro.trim())}`
    }
    const res = await fetchWithErrorHandling(url, {
      method: 'GET',
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
    })
    const data = await res.json()
    return Array.isArray(data) ? data : []
  } catch (error) {
    console.error('[obtenerObras] ', error)
    return []
  }
}

/* Filtrar obras por estado o localidad (GET /obras/filtrar?estado=X&localidad=Y) */
export async function filtrarObras({
  estado,
  cod_localidad,
}: {
  estado?: string
  cod_localidad?: number
}): Promise<Obra[]> {
  try {
    const token = await getAccessToken()
    const params = new URLSearchParams()
    if (estado) params.append('estado', estado)
    if (cod_localidad) params.append('localidad', String(cod_localidad))
    const url = `${baseUrl}/filtrar?${params.toString()}`
    const res = await fetchWithErrorHandling(url, {
      method: 'GET',
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
    })
    const data = await res.json()
    return Array.isArray(data) ? data : []
  } catch (error) {
    console.error('[filtrarObras] ', error)
    return []
  }
}

/* Server Action que envuelve filtrarObras para pasarla a componentes cliente */
export async function filtrarObrasAction(filters: {
  estado?: string
  cod_localidad?: number
  cod_provincia?: number
}): Promise<Obra[]> {
  try {
    return await filtrarObras({
      estado: filters.estado,
      cod_localidad: filters.cod_localidad,
    })
  } catch (err) {
    console.error('[filtrarObrasAction] ', err)
    return []
  }
}

/* Obtener obra por ID (GET /obras/:id) */
export async function obtenerObra(id: number): Promise<Obra> {
  if (id === undefined || id === null) throw new Error('ID de obra inválido')
  const numericId = typeof id === 'string' ? Number(id) : id
  if (isNaN(numericId) || numericId <= 0) throw new Error('ID de obra inválido')

  try {
    const token = await getAccessToken()
    const res = await fetchWithErrorHandling(`${baseUrl}/${numericId}`, {
      method: 'GET',
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
    })
    return await res.json()
  } catch (error) {
    console.error('[obtenerObra] ', error)
    throw new Error(`No se pudo obtener la obra #${numericId}`)
  }
}

/* Obtener obras "completas": intenta /completas, si falla usa /filtrar */
export async function obtenerObrasCompletas({
  estado,
  cod_localidad,
}: {
  estado?: string
  cod_localidad?: number
}): Promise<Obra[]> {
  try {
    const token = await getAccessToken()
    const params = new URLSearchParams()
    if (estado) params.append('estado', estado)
    if (cod_localidad) params.append('localidad', String(cod_localidad))

    const url = `${baseUrl}`
    try {
      const res = await fetchWithErrorHandling(url, {
        method: 'GET',
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      })
      const data = await res.json()
      return Array.isArray(data) ? data : []
    } catch {
      return await filtrarObras({ estado, cod_localidad })
    }
  } catch (error) {
    console.error('[obtenerObrasCompletas] ', error)
    return await filtrarObras({ estado, cod_localidad })
  }
}

/* Eliminar obra (DELETE /obras/:id) */
export async function deleteObra(
  id: number
): Promise<{ success: boolean; error?: string }> {
  try {
    const token = await getAccessToken()
    await fetchWithErrorHandling(`${baseUrl}/${id}`, {
      method: 'DELETE',
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
    })
    revalidatePath('/ventas/obras')
    return { success: true }
  } catch (error: any) {
    console.error('[deleteObra] ', error)
    return { success: false, error: error?.message ?? 'Error desconocido' }
  }
}

/* Subir nota de fábrica (POST /obras/:id/nota-fabrica) */
export async function uploadNotaFabrica(
  codObra: number,
  file: FormData
): Promise<Obra> {
  try {
    const token = await getAccessToken()
    const res = await fetchWithErrorHandling(
      `${baseUrl}/${codObra}/nota-fabrica`,
      {
        method: 'POST',
        headers: { Authorization: `Bearer ${token}` },
        body: file,
      }
    )
    const data = await res.json()
    revalidatePath('/ventas/obras')
    return data
  } catch (error) {
    console.error('[uploadNotaFabrica] ', error)
    throw error
  }
}

/* Eliminar nota de fábrica (DELETE /obras/:id/nota-fabrica) */
export async function deleteNotaFabrica(codObra: number): Promise<Obra> {
  try {
    const token = await getAccessToken()
    const res = await fetchWithErrorHandling(
      `${baseUrl}/${codObra}/nota-fabrica`,
      {
        method: 'DELETE',
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      }
    )
    const data = await res.json()
    revalidatePath('/ventas/obras')
    return data
  } catch (error) {
    console.error('[deleteNotaFabrica] ', error)
    throw error
  }
}
