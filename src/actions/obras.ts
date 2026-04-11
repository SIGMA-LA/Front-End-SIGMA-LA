'use server'

import { revalidatePath, revalidateTag } from 'next/cache'
import { cache } from 'react'
import { fetchWithErrorHandling } from '@/lib/fetchWithErrorHandling'
import { logger } from '@/lib/logger'
import { getAccessToken } from './auth'
import type {
  Obra,
  CreateObraInput,
  UpdateObraInput,
  PresupuestoInput,
  EstadoObra,
  EstadoNotaFabricaProduccion,
  PaginatedResponse,
} from '@/types'
import type { ActionResponse } from '@/types/actions'

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
    const res = await fetchWithErrorHandling<Obra>(`${BASE_URL}/${cod_obra}`, {
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
 * Searches obras by text filter (paginated)
 * @param {string} filter - Optional search query
 * @param {number} page - Page number (1-indexed)
 * @param {number} pageSize - Items per page
 * @returns {Promise<PaginatedResponse<Obra>>} Paginated list of matching obras
 */
export async function getObras(
  filter?: string,
  page: number = 1,
  pageSize: number = 25,
): Promise<PaginatedResponse<Obra>> {
  const emptyResponse: PaginatedResponse<Obra> = {
    data: [], total: 0, totalPages: 0, page, pageSize,
  }
  try {
    const token = await getAccessToken()
    const params = new URLSearchParams()
    params.append('page', String(page))
    params.append('pageSize', String(pageSize))

    let url: string
    if (filter && filter.trim().length > 0) {
      params.append('q', filter.trim())
      url = `${BASE_URL}/buscar?${params.toString()}`
    } else {
      url = `${BASE_URL}?${params.toString()}`
    }

    const res = await fetchWithErrorHandling<PaginatedResponse<Obra>>(url, {
      method: 'GET',
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
      next: { revalidate: 0, tags: ['obras'] },
    })
    const data = await res.json()
    // Validate it's actually a paginated response
    if (data && typeof data === 'object' && 'data' in data && Array.isArray(data.data)) {
      return data as PaginatedResponse<Obra>
    }
    return emptyResponse
  } catch (error) {
    console.error('[getObras]', error)
    return emptyResponse
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

    const res = await fetchWithErrorHandling<Obra[]>(url, {
      method: 'GET',
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
      next: { revalidate: 0, tags: ['obras'] },
    })
    return await res.json()
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
    const res = await fetchWithErrorHandling<Obra[]>(url, {
      method: 'GET',
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
      next: { revalidate: 0, tags: [`obras-cliente-${cuil}`] },
    })
    return await res.json()
  } catch (error) {
    console.error('[getObrasByCliente]', error)
    return []
  }
}

/**
 * Filters obras by estado or localidad (paginated)
 * @param {Object} params - Filter parameters
 * @param {string} params.estado - Obra estado filter
 * @param {number} params.cod_localidad - Localidad code filter
 * @param {number} params.page - Page number (1-indexed)
 * @param {number} params.pageSize - Items per page
 * @returns {Promise<PaginatedResponse<Obra>>} Paginated filtered list of obras
 */
export async function filterObras({
  estado,
  cod_localidad,
  page = 1,
  pageSize = 25,
}: {
  estado?: EstadoObra | string
  cod_localidad?: number
  page?: number
  pageSize?: number
}): Promise<PaginatedResponse<Obra>> {
  const emptyResponse: PaginatedResponse<Obra> = {
    data: [], total: 0, totalPages: 0, page, pageSize,
  }
  try {
    const token = await getAccessToken()
    const params = new URLSearchParams()
    if (estado) params.append('estado', estado)
    if (cod_localidad) params.append('localidad', String(cod_localidad))
    params.append('page', String(page))
    params.append('pageSize', String(pageSize))
    const url = `${BASE_URL}/filtrar?${params.toString()}`
    const res = await fetchWithErrorHandling<PaginatedResponse<Obra>>(url, {
      method: 'GET',
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
      next: { revalidate: 30, tags: ['obras'] },
    })
    const data = await res.json()
    if (data && typeof data === 'object' && 'data' in data && Array.isArray(data.data)) {
      return data as PaginatedResponse<Obra>
    }
    return emptyResponse
  } catch (error) {
    console.error('[filterObras]', error)
    return emptyResponse
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
): Promise<ActionResponse<Obra>> {
  try {
    const token = await getAccessToken()
    const res = await fetchWithErrorHandling(
      `${BASE_URL}/${codObra}/nota-fabrica`,
      {
        method: 'POST',
        headers: { Authorization: `Bearer ${token}` },
        body: file,
        timeout: 60000,
      }
    )
    const data = await res.json()
    revalidatePath('/ventas/obras')
    return { success: true, data }
  } catch (error) {
    const message =
      error instanceof Error ? error.message : 'No se pudo subir la nota de fábrica. Intentá nuevamente.'
    console.error('[uploadNotaFabrica]', message)
    return { success: false, error: message }
  }
}

/**
 * Deletes nota fabrica file from an obra
 * @param {number} codObra - Obra code/ID
 * @returns {Promise<Obra>} Updated obra
 */
export async function deleteNotaFabrica(
  codObra: number
): Promise<ActionResponse<Obra>> {
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
    return { success: true, data }
  } catch (error) {
    const message =
      error instanceof Error ? error.message : 'No se pudo eliminar la nota de fábrica. Intentá nuevamente.'
    console.error('[deleteNotaFabrica]', message)
    return { success: false, error: message }
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
    const res = await fetchWithErrorHandling<Obra[]>(url, {
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
): Promise<ActionResponse<Obra>> {
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
    return { success: true, data }
  } catch (error: unknown) {
    const message =
      error instanceof Error ? error.message : 'Error al crear la obra'
    console.error('[crearObra]', message)
    return { success: false, error: message }
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
): Promise<ActionResponse<Obra>> {
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
    return { success: true, data }
  } catch (error) {
    const message =
      error instanceof Error ? error.message : 'No se pudo actualizar la obra. Intentá nuevamente.'
    console.error('[actualizarObra]', message)
    return { success: false, error: message }
  }
}

/**
 * Deletes an obra by ID
 * @param {number} id - Obra ID
 * @returns {Promise<{success: boolean, error?: string}>} Operation result
 */
export async function deleteObra(id: number): Promise<ActionResponse> {
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
    const message = error instanceof Error ? error.message : 'No se pudo eliminar la obra. Intentá nuevamente.'
    console.error('[deleteObra]', message)
    return { success: false, error: message }
  }
}

/**
 * Cancels an obra by ID
 * @param {number} id - Obra ID
 * @returns {Promise<{success: boolean, error?: string}>} Operation result
 */
export async function cancelObra(id: number): Promise<ActionResponse> {
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
    const message = error instanceof Error ? error.message : 'No se pudo cancelar la obra. Intentá nuevamente.'
    console.error('[cancelObra]', message)
    return { success: false, error: message }
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
export async function solicitarStockObra(
  id: number
): Promise<ActionResponse<Obra>> {
  try {
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
    const data = await res.json()
    revalidatePath('/coordinacion/pedidos')
    revalidatePath('/ventas/obras')
    return { success: true, data }
  } catch (error) {
    const message =
      error instanceof Error ? error.message : 'Error al solicitar stock'
    console.error('[solicitarStockObra]', message)
    return { success: false, error: message }
  }
}

/**
 * Changes obra status to 'EN PRODUCCION'
 * @param {number} id - Obra ID
 * @returns {Promise<Obra>} Updated obra
 */
export async function recibirStockObra(
  id: number
): Promise<ActionResponse<Obra>> {
  try {
    const token = await getAccessToken()
    const res = await fetchWithErrorHandling(
      `${BASE_URL}/${id}/recibir-stock`,
      {
        method: 'PATCH',
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      }
    )
    const data = await res.json()
    revalidatePath('/coordinacion/pedidos')
    revalidatePath('/produccion')
    return { success: true, data }
  } catch (error) {
    const message =
      error instanceof Error ? error.message : 'Error al recibir stock'
    console.error('[recibirStockObra]', message)
    return { success: false, error: message }
  }
}

/**
 * Changes obra status to 'PRODUCCION FINALIZADA'
 * @param {number} id - Obra ID
 * @returns {Promise<Obra>} Updated obra
 */
export async function finalizarProduccionObra(
  id: number
): Promise<ActionResponse<Obra>> {
  const endpoint = `${BASE_URL}/${id}/finalizar-produccion`

  try {
    const token = await getAccessToken()
    logger.info('[finalizarProduccionObra] PATCH request', {
      id,
      endpoint,
      baseUrl: BASE_URL,
      apiUrl: API_URL,
      hasToken: Boolean(token),
    })

    const res = await fetchWithErrorHandling(endpoint, {
      method: 'PATCH',
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
    })
    const data = await res.json()

    logger.info('[finalizarProduccionObra] PATCH success', {
      id,
      endpoint,
    })

    revalidateTag('notas-fabrica')
    revalidateTag('ordenes-produccion')
    revalidateTag('obras')
    revalidatePath('/produccion')
    revalidatePath('/obras')
    return { success: true, data }
  } catch (error) {
    const message =
      error instanceof Error
        ? error.message
        : 'Error al finalizar la producción'

    logger.error('[finalizarProduccionObra] PATCH failed', {
      id,
      endpoint,
      baseUrl: BASE_URL,
      apiUrl: API_URL,
      error: message,
    })

    console.error('[finalizarProduccionObra]', message)
    return { success: false, error: message }
  }
}
