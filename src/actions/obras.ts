'use server'

import { revalidatePath } from 'next/cache'
import { cache } from 'react'
import { fetchWithErrorHandling } from '@/lib/fetchWithErrorHandling'
import { getAccessToken } from './auth'
import type {
  Obra,
  CreateObraInput,
  UpdateObraInput,
  PresupuestoInput,
  EstadoObra,
} from '@/types'

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000/api'
const BASE_URL = API_URL.endsWith('/obras') ? API_URL : `${API_URL}/obras`

/**
 * Retrieves a single obra by ID (cached with React cache)
 * @param {number} cod_obra - Obra code/ID
 * @returns {Promise<Obra | null>} Obra data or null if not found
 */
export const getObra = cache(async (cod_obra: number): Promise<Obra | null> => {
  try {
    const token = await getAccessToken()
    const res = await fetchWithErrorHandling(`${BASE_URL}/${cod_obra}`, {
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
    console.error('[getObra]', error)
    return null
  }
})

/**
 * Searches obras by text filter
 * @param {string} filter - Optional search query
 * @returns {Promise<Obra[]>} List of matching obras
 */
export async function getObras(filter?: string): Promise<Obra[]> {
  try {
    const token = await getAccessToken()
    let url = BASE_URL
    if (filter && filter.trim().length > 0) {
      url = `${BASE_URL}/buscar?q=${encodeURIComponent(filter.trim())}`
    }
    const res = await fetchWithErrorHandling(url, {
      method: 'GET',
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
      next: { revalidate: 0, tags: ['obras'] },
    })
    const data = await res.json()
    return Array.isArray(data) ? data : data.data || []
  } catch (error) {
    console.error('[getObras]', error)
    return []
  }
}

/**
 * Filters obras by estado or localidad
 * @param {Object} params - Filter parameters
 * @param {string} params.estado - Obra estado filter
 * @param {number} params.cod_localidad - Localidad code filter
 * @returns {Promise<Obra[]>} Filtered list of obras
 */
export async function filterObras({
  estado,
  cod_localidad,
}: {
  estado?: EstadoObra
  cod_localidad?: number
}): Promise<Obra[]> {
  try {
    const token = await getAccessToken()
    const params = new URLSearchParams()
    if (estado) params.append('estado', estado)
    if (cod_localidad) params.append('localidad', String(cod_localidad))
    const url = `${BASE_URL}/filtrar?${params.toString()}`
    const res = await fetchWithErrorHandling(url, {
      method: 'GET',
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
      next: { revalidate: 30, tags: ['obras'] },
    })
    const data = await res.json()
    return Array.isArray(data) ? data : []
  } catch (error) {
    console.error('[filterObras]', error)
    return []
  }
}

/**
 * Uploads nota fabrica file for an obra
 * @param {number} codObra - Obra code/ID
 * @param {FormData} file - FormData with the file
 * @returns {Promise<Obra>} Updated obra
 */
export async function uploadNotaFabrica(
  codObra: number,
  file: FormData
): Promise<Obra> {
  try {
    const token = await getAccessToken()
    const res = await fetchWithErrorHandling(
      `${BASE_URL}/${codObra}/nota-fabrica`,
      {
        method: 'POST',
        headers: { Authorization: `Bearer ${token}` },
        body: file,
        timeout: 60000, // 60 segundos para archivos grandes
      }
    )
    const data = await res.json()
    revalidatePath('/ventas/obras')
    return data
  } catch (error) {
    console.error('[uploadNotaFabrica]', error)
    throw error
  }
}

/**
 * Deletes nota fabrica file from an obra
 * @param {number} codObra - Obra code/ID
 * @returns {Promise<Obra>} Updated obra
 */
export async function deleteNotaFabrica(codObra: number): Promise<Obra> {
  try {
    const token = await getAccessToken()
    const res = await fetchWithErrorHandling(
      `${BASE_URL}/${codObra}/nota-fabrica`,
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
    console.error('[deleteNotaFabrica]', error)
    throw error
  }
}

/**
 * Retrieves obras with nota fabrica but no approved or in-production orders
 * @returns {Promise<Obra[]>} List of obras
 */
export async function getNotasSinOrdenAprobada(): Promise<Obra[]> {
  try {
    const token = await getAccessToken()
    const res = await fetchWithErrorHandling(
      `${BASE_URL}/notas-sin-orden-aprobada`,
      {
        method: 'GET',
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        next: {
          revalidate: 30,
          tags: ['notas-sin-orden'],
        },
      }
    )
    const data = await res.json()
    return Array.isArray(data) ? data : []
  } catch (error) {
    console.error('[getNotasSinOrdenAprobada]', error)
    return []
  }
}

/**
 * Retrieves obras in production with nota fabrica and orders in process
 * @returns {Promise<Obra[]>} List of obras
 */
export async function getNotasConOrdenEnProceso(): Promise<Obra[]> {
  try {
    const token = await getAccessToken()
    const res = await fetchWithErrorHandling(
      `${BASE_URL}/notas-con-orden-proceso`,
      {
        method: 'GET',
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        next: {
          revalidate: 30,
          tags: ['notas-con-orden'],
        },
      }
    )
    const data = await res.json()
    return Array.isArray(data) ? data : []
  } catch (error) {
    console.error('[getNotasConOrdenEnProceso]', error)
    return []
  }
}

/**
 * Retrieves obras for a specific cliente by CUIL
 * @param {string} cuil - Cliente CUIL identifier
 * @returns {Promise<Obra[]>} List of Obras
 */
export async function getClienteObras(cuil: string): Promise<Obra[]> {
  if (!cuil) return []
  try {
    const token = await getAccessToken()
    const res = await fetchWithErrorHandling(
      `${BASE_URL}/cliente/${encodeURIComponent(cuil)}`,
      {
        method: 'GET',
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      }
    )

    return (await res.json()) as Obra[]
  } catch (error) {
    console.error('[getClienteObras]', error)
    return []
  }
}

/**
 * Creates a new obra
 * @param obraData - Obra data
 * @param presupuesto - Presupuesto data (optional)
 * @returns Created obra
 */
export async function createObra(
  obraData: CreateObraInput,
  presupuesto: PresupuestoInput[] | null = null
): Promise<Obra> {
  try {
    const token = await getAccessToken()
    const payload: Record<string, unknown> = { ...obraData }

    if (presupuesto) {
      payload.presupuesto = {
        create: presupuesto,
      }
    }

    const res = await fetchWithErrorHandling(BASE_URL, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(payload),
    })
    const data = await res.json()
    revalidatePath('/ventas/obras')
    return data
  } catch (error: unknown) {
    console.error('[crearObra]', error)
    throw error instanceof Error ? error : new Error('Error al crear la obra')
  }
}

/**
 * Updates an existing obra
 * @param codObra - Obra ID
 * @param obraData - Updated obra data
 * @returns Updated obra
 */
export async function updateObra(
  codObra: number,
  obraData: UpdateObraInput
): Promise<Obra> {
  try {
    const token = await getAccessToken()
    const res = await fetchWithErrorHandling(`${BASE_URL}/${codObra}`, {
      method: 'PUT',
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(obraData),
    })
    const data = await res.json()
    revalidatePath('/ventas/obras')
    revalidatePath(`/ventas/obras/${codObra}`)
    return data
  } catch (error) {
    console.error('[actualizarObra]', error)
    throw error
  }
}

/**
 * Deletes an obra by ID
 * @param {number} id - Obra ID
 * @returns {Promise<{success: boolean, error?: string}>} Operation result
 */
export async function deleteObra(
  id: number
): Promise<{ success: boolean; error?: string }> {
  try {
    const token = await getAccessToken()
    await fetchWithErrorHandling(`${BASE_URL}/${id}`, {
      method: 'DELETE',
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
    })
    revalidatePath('/ventas/obras')
    return { success: true }
  } catch (error) {
    console.error('[deleteObra]', error)
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error',
    }
  }
}

/**
 * Cancels an obra by ID
 * @param {number} id - Obra ID
 * @returns {Promise<{success: boolean, error?: string}>} Operation result
 */
export async function cancelObra(
  id: number
): Promise<{ success: boolean; error?: string }> {
  try {
    const token = await getAccessToken()
    await fetchWithErrorHandling(`${BASE_URL}/${id}`, {
      method: 'PUT',
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ estado: 'CANCELADA' }),
    })
    revalidatePath('/ventas/obras')
    return { success: true }
  } catch (error) {
    console.error('[cancelObra]', error)
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error',
    }
  }
}

/**
 * Retrieves obras eligible for stock request (PAGADA PARCIALMENTE from empresas)
 * @returns {Promise<Obra[]>} List of obras
 */
export async function getObrasParaPedidoStock(): Promise<Obra[]> {
  try {
    const token = await getAccessToken()
    const res = await fetchWithErrorHandling(`${BASE_URL}/para-pedido-stock`, {
      method: 'GET',
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
      next: {
        revalidate: 30,
        tags: ['obras', 'obras-pedido-stock'],
      },
    })
    const data = await res.json()
    return Array.isArray(data) ? data : []
  } catch (error) {
    console.error('[getObrasParaPedidoStock]', error)
    return []
  }
}

/**
 * Changes obra status to 'EN ESPERA DE STOCK'
 * @param {number} id - Obra ID
 * @returns {Promise<Obra>} Updated obra
 */
export async function solicitarStockObra(id: number): Promise<Obra> {
  const token = await getAccessToken()
  const res = await fetchWithErrorHandling(
    `${BASE_URL}/${id}/solicitar-stock`,
    {
      method: 'PATCH',
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
    }
  )
  revalidatePath('/coordinacion/pedidos')
  revalidatePath('/ventas/obras')
  return await res.json()
}

/**
 * Changes obra status to 'EN PRODUCCION'
 * @param {number} id - Obra ID
 * @returns {Promise<Obra>} Updated obra
 */
export async function recibirStockObra(id: number): Promise<Obra> {
  const token = await getAccessToken()
  const res = await fetchWithErrorHandling(`${BASE_URL}/${id}/recibir-stock`, {
    method: 'PATCH',
    headers: {
      Authorization: `Bearer ${token}`,
      'Content-Type': 'application/json',
    },
  })
  revalidatePath('/coordinacion/pedidos')
  revalidatePath('/produccion')
  return await res.json()
}
