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
  EstadoNotaFabricaProduccion,
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
    return data
  } catch (error) {
    console.error('[getObras]', error)
    return []
  }
}

/**
 * Searches obras filtered for creation of entregas
 * @param {string} filter - Optional search query
 * @param {boolean} esFinal - Boolean to filter by Entrega Final or Entrega Parcial
 * @returns {Promise<Obra[]>} List of matching obras
 */
export async function getObrasParaEntrega(
  filter: string = '',
  esFinal: boolean = false
): Promise<Obra[]> {
  try {
    const token = await getAccessToken()
    const params = new URLSearchParams()
    if (filter.trim().length > 0) {
      params.append('q', filter.trim())
    }
    params.append('esFinal', String(esFinal))

    const url = `${BASE_URL}/para-entrega?${params.toString()}`
    
    const res = await fetchWithErrorHandling(url, {
      method: 'GET',
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
      next: { revalidate: 0, tags: ['obras'] },
    })
    const data = await res.json()
    return data
  } catch (error) {
    console.error('[getObrasParaEntrega]', error)
    return []
  }
}

/**
 * Retrieves obras associated with a specific client by CUIL
 * @param {string} cuil - Client CUIL
 * @returns {Promise<Obra[]>} List of matching obras
 */
export async function getObrasByCliente(cuil: string): Promise<Obra[]> {
  try {
    const token = await getAccessToken()
    const url = `${BASE_URL}/cliente/${encodeURIComponent(cuil)}`
    const res = await fetchWithErrorHandling(url, {
      method: 'GET',
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
      next: { revalidate: 0, tags: [`obras-cliente-${cuil}`] },
    })
    const data = await res.json()
    return data
  } catch (error) {
    console.error('[getObrasByCliente]', error)
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
  estado?: EstadoObra | string
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

export interface NotasFabricaFilters {
  estado: EstadoNotaFabricaProduccion
  fechaDesde?: string
  fechaHasta?: string
}

/**
 * Retrieves notas de fabrica for produccion by estado and optional filters.
 */
export async function getNotasFabricaProduccion({
  estado,
  fechaDesde,
  fechaHasta,
}: NotasFabricaFilters): Promise<Obra[]> {
  try {
    const params = new URLSearchParams()
    params.set('estado', estado)
    if (fechaDesde) params.set('fechaDesde', fechaDesde)
    if (fechaHasta) params.set('fechaHasta', fechaHasta)

    const url = `${BASE_URL}/notas-fabrica?${params.toString()}`

    const token = await getAccessToken()
    const res = await fetchWithErrorHandling(url, {
      method: 'GET',
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
      next: {
        revalidate: 0,
        tags: ['notas-fabrica', `notas-fabrica-${estado.toLowerCase()}`],
      },
    })

    const data = await res.json()
    return Array.isArray(data) ? data : []
  } catch (error) {
    if (error instanceof Error && error.message === 'Not found') {
      return []
    }
    console.error('[getNotasFabricaProduccion]', error)
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
