'use server'

import { Obra } from '@/types'
import { getAccessToken } from './auth'
import { revalidatePath } from 'next/cache'
import { fetchWithErrorHandling } from '@/lib/fetchWithErrorHandling'
import { cache } from 'react'

const API_BASE = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000/api'
const baseUrl = API_BASE.endsWith('/obras') ? API_BASE : `${API_BASE}/obras`

/* Obtener una obra por ID (GET /obras/:id) - Cachear por 30 segundos con Next.js Data Cache */
export const getObraById = cache(
  async (cod_obra: number): Promise<Obra | null> => {
    try {
      const token = await getAccessToken()
      const res = await fetchWithErrorHandling(`${baseUrl}/${cod_obra}`, {
        method: 'GET',
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        next: {
          revalidate: 30,
          tags: [`obra-${cod_obra}`],
        },
      })
      return await res.json()
    } catch (error) {
      console.error('[getObraById] ', error)
      return null
    }
  }
)

/* Buscar obras por texto (GET /obras/buscar?{texto}) */
export async function obtenerObras(filtro?: string): Promise<Obra[]> {
  try {
    const token = await getAccessToken()
    let url = baseUrl
    if (filtro && filtro.trim().length > 0) {
      url = `${baseUrl}/buscar?q=${encodeURIComponent(filtro.trim())}`
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

export async function filtrarObrasAction(filters: {
  estado?: string
  cod_localidad?: number
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
