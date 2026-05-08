'use server'

import { revalidatePath, revalidateTag } from 'next/cache'
import { fetchWithErrorHandling } from '@/lib/fetchWithErrorHandling'
import { getAccessToken } from './auth'
import type { EstadoOrdenProduccion, OrdenProduccion, PaginatedResponse } from '@/types'
import type { ActionResponse } from '@/types/actions'

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000/api'
const BASE_URL = API_URL.endsWith('/ordenes-produccion')
  ? API_URL
  : `${API_URL}/ordenes-produccion`

/**
 * Retrieves a single orden de produccion by code
 * @param {number} cod_op - Orden de produccion code/ID
 * @returns {Promise<{success: boolean, data?: OrdenProduccion, error?: string}>} Operation result with orden data
 */
export async function getOrdenProduccion(
  cod_op: number
): Promise<ActionResponse<OrdenProduccion>> {
  try {
    const token = await getAccessToken()
    const response = await fetchWithErrorHandling<OrdenProduccion>(
      `${BASE_URL}/${cod_op}`,
      {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        next: { revalidate: 30, tags: [`orden-${cod_op}`] },
      }
    )

    const data = await response.json()
    return { success: true, data }
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Error desconocido'
    console.error('[getOrdenProduccion]', message)
    return { success: false, error: message }
  }
}

/**
 * Retrieves ordenes de produccion with optional estado/date filters.
 * Accepts either a plain estado string or a filters object.
 * @returns {Promise<ActionResponse<PaginatedResponse<OrdenProduccion>>>} Operation result with paginated ordenes list
 */
export async function getOrdenesProduccion(
  filtersOrEstado?:
    | EstadoOrdenProduccion
    | OrdenesProduccionBusquedaAvanzadaFilters,
  page: number = 1,
  pageSize: number = 25
): Promise<ActionResponse<PaginatedResponse<OrdenProduccion>>> {
  try {
    const filters =
      typeof filtersOrEstado === 'string' ||
        typeof filtersOrEstado === 'undefined'
        ? { estado: filtersOrEstado }
        : filtersOrEstado

    const data = await getOrdenesProduccionBusquedaAvanzada(filters, page, pageSize)
    return { success: true, data }
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Error desconocido'
    console.error('[getOrdenesProduccion]', message)
    return {
      success: false,
      error: message,
      data: { data: [], total: 0, totalPages: 0, page, pageSize },
    }
  }
}

/**
 * Filters used by Produccion page to fetch ordenes lazily by estado.
 */
export interface OrdenesProduccionEstadoFechasFilters {
  estado?: EstadoOrdenProduccion
  fechaDesde?: string
  fechaHasta?: string
  cod_obra?: number
  cuil_cliente?: string
}

export type OrdenesProduccionBusquedaAvanzadaFilters =
  OrdenesProduccionEstadoFechasFilters

async function fetchOrdenesConFiltros(
  filters: OrdenesProduccionBusquedaAvanzadaFilters,
  revalidate: number,
  tags: string[],
  page: number = 1,
  pageSize: number = 25
): Promise<PaginatedResponse<OrdenProduccion>> {
  const params = new URLSearchParams()
  if (filters.estado) params.set('estado', filters.estado)
  if (filters.fechaDesde) params.set('fechaDesde', filters.fechaDesde)
  if (filters.fechaHasta) params.set('fechaHasta', filters.fechaHasta)
  if (filters.cod_obra) params.set('cod_obra', String(filters.cod_obra))
  if (filters.cuil_cliente) params.set('cuil_cliente', filters.cuil_cliente)
  params.set('page', String(page))
  params.set('pageSize', String(pageSize))

  const url = `${BASE_URL}?${params.toString()}`
  const token = await getAccessToken()
  const response = await fetchWithErrorHandling<PaginatedResponse<OrdenProduccion>>(url, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
    },
    next: { revalidate, tags },
  })

  const data = await response.json()
  if (data && typeof data === 'object' && 'data' in data && Array.isArray(data.data)) {
    return data as PaginatedResponse<OrdenProduccion>
  }

  return { data: [], total: 0, totalPages: 0, page, pageSize }
}

/**
 * Retrieves ordenes for Produccion view by estado and optional date filters.
 */
export async function getOrdenesProduccionPorEstadoYFechas({
  estado,
  fechaDesde,
  fechaHasta,
  cuil_cliente,
  page = 1,
  pageSize = 25,
}: OrdenesProduccionEstadoFechasFilters & { page?: number, pageSize?: number }): Promise<PaginatedResponse<OrdenProduccion>> {
  try {
    const estadoTag = estado ? estado.replace(/\s+/g, '-').toLowerCase() : 'all'

    return await fetchOrdenesConFiltros({ estado, fechaDesde, fechaHasta, cuil_cliente }, 0, [
      'ordenes-produccion',
      `ordenes-produccion-${estadoTag}`,
    ], page, pageSize)
  } catch (error) {
    console.error('[getOrdenesProduccionPorEstadoYFechas]', error)
    return { data: [], total: 0, totalPages: 0, page, pageSize }
  }
}

export async function getOrdenesProduccionBusquedaAvanzada({
  estado,
  fechaDesde,
  fechaHasta,
  cod_obra,
  cuil_cliente,
}: OrdenesProduccionBusquedaAvanzadaFilters, page: number = 1, pageSize: number = 25): Promise<PaginatedResponse<OrdenProduccion>> {
  try {
    return await fetchOrdenesConFiltros(
      { estado, fechaDesde, fechaHasta, cod_obra, cuil_cliente },
      30,
      ['ordenes-produccion'],
      page,
      pageSize
    )
  } catch (error) {
    console.error('[getOrdenesProduccionBusquedaAvanzada]', error)
    return { data: [], total: 0, totalPages: 0, page, pageSize }
  }
}

/**
 * Retrieves ordenes de produccion by estado and optional filters.
 */
export async function getOrdenesProduccionFiltradas({
  estado,
  fechaDesde,
  fechaHasta,
  page = 1,
  pageSize = 25,
}: OrdenesProduccionEstadoFechasFilters & { page?: number, pageSize?: number }): Promise<PaginatedResponse<OrdenProduccion>> {
  return getOrdenesProduccionPorEstadoYFechas({
    estado,
    fechaDesde,
    fechaHasta,
    page,
    pageSize,
  })
}

/**
 * Retrieves all ordenes de produccion for a specific obra
 * @param {number} cod_obra - Obra code
 * @returns {Promise<OrdenProduccion[]>} List of ordenes for the obra
 */
export async function getOrdenesByObra(
  cod_obra: number
): Promise<OrdenProduccion[]> {
  try {
    const token = await getAccessToken()
    const response = await fetchWithErrorHandling<OrdenProduccion[]>(
      `${BASE_URL}/obra/${cod_obra}`,
      {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        next: {
          revalidate: 30,
          tags: ['ordenes-produccion', `ordenes-obra-${cod_obra}`],
        },
      }
    )

    const data = await response.json()
    return Array.isArray(data) ? data : []
  } catch (error) {
    if (error instanceof Error && error.message === 'Not found') {
      return []
    }
    console.error('[getOrdenesByObra]', error)
    return []
  }
}

/**
 * Retrieves finalized ordenes de produccion for a specific obra
 * @param {number} cod_obra - Obra code
 * @returns {Promise<OrdenProduccion[]>} List of finalized ordenes for the obra
 */
export async function getOrdenesByObraAndFinalizada(
  cod_obra: number
): Promise<OrdenProduccion[]> {
  try {
    const token = await getAccessToken()
    const response = await fetchWithErrorHandling<OrdenProduccion[]>(
      `${BASE_URL}/obra/${cod_obra}/finalizada`,
      {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        next: {
          revalidate: 30,
          tags: ['ordenes-produccion', `ordenes-obra-${cod_obra}`],
        },
      }
    )

    const data = await response.json()
    return Array.isArray(data) ? data : []
  } catch (error) {
    console.error('[getOrdenesByObraAndFinalizada]', error)
    return []
  }
}

/**
 * Creates a new orden de produccion
 * @param {FormData} formData - Form data with cod_obra and PDF file
 * @returns {Promise<{success: boolean, data?: OrdenProduccion, error?: string}>} Operation result
 */
export async function createOrdenProduccion(
  formData: FormData
): Promise<ActionResponse<OrdenProduccion>> {
  try {
    const cod_obra = formData.get('cod_obra') as string
    const file = formData.get('file') as File

    if (!file || file.size === 0) {
      return { success: false, error: 'Debe seleccionar un archivo' }
    }

    if (file.type !== 'application/pdf') {
      return { success: false, error: 'Solo se permiten archivos PDF' }
    }

    const backendFormData = new FormData()
    backendFormData.append('cod_obra', cod_obra)
    backendFormData.append('file', file)

    const token = await getAccessToken()

    const response = await fetchWithErrorHandling(BASE_URL, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${token}`,
      },
      body: backendFormData,
    })

    const wrapper = await response.json()
    const data = wrapper.data || wrapper
    revalidateTag('ordenes-produccion')
    revalidateTag('notas-fabrica')
    revalidatePath('/produccion')
    revalidatePath('/obras')

    return { success: true, data }
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Error desconocido'
    console.error('[createOrdenProduccion]', message)
    return { success: false, error: message }
  }
}

/**
 * Approves an orden de produccion (changes estado to APROBADA)
 * @param {number} cod_op - Orden de produccion code/ID
 * @returns {Promise<{success: boolean, data?: OrdenProduccion, error?: string, message?: string}>} Operation result
 */
export async function approveOrdenProduccion(
  cod_op: number
): Promise<ActionResponse<OrdenProduccion>> {
  try {
    const token = await getAccessToken()
    const response = await fetchWithErrorHandling(
      `${BASE_URL}/${cod_op}/aprobar`,
      {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          estado: 'APROBADA',
          fecha_validacion: new Date().toISOString(),
        }),
      }
    )

    const data = await response.json()
    revalidateTag('ordenes-produccion')
    revalidatePath('/coordinacion/ordenes-produccion')

    return { success: true, data }
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Error desconocido'
    console.error('[approveOrdenProduccion]', message)
    return { success: false, error: message }
  }
}

/**
 * Starts production for an orden (changes estado to EN PRODUCCION)
 * @param {number} cod_op - Orden de produccion code/ID
 * @returns {Promise<{success: boolean, message?: string, error?: string}>} Operation result
 */
export async function startProduccion(
  cod_op: number
): Promise<ActionResponse<OrdenProduccion>> {
  try {
    const token = await getAccessToken()
    const response = await fetchWithErrorHandling<OrdenProduccion>(
      `${BASE_URL}/${cod_op}/iniciar`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
      }
    )

    const data = await response.json()
    revalidateTag('ordenes-produccion')
    revalidateTag('notas-fabrica')
    revalidatePath('/produccion')
    revalidatePath('/coordinacion/ordenes-produccion')

    return { success: true, data }
  } catch (error) {
    const message =
      error instanceof Error ? error.message : 'Error al iniciar producción'
    console.error('[startProduccion]', message)
    return { success: false, error: message }
  }
}

/**
 * Finalizes production for an orden (changes estado to FINALIZADA)
 * @param {number} cod_op - Orden de produccion code/ID
 * @returns {Promise<{success: boolean, message?: string, error?: string}>} Operation result
 */
export async function finishProduccion(
  cod_op: number
): Promise<ActionResponse<OrdenProduccion>> {
  try {
    const token = await getAccessToken()
    const response = await fetchWithErrorHandling<OrdenProduccion>(
      `${BASE_URL}/${cod_op}/finalizar`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
      }
    )

    const data = await response.json()
    revalidateTag('ordenes-produccion')
    revalidateTag('notas-fabrica')
    revalidateTag('obras')
    // Si la OP contiene cod_obra, invalidar también el caché específico de esa obra
    if (data && data.cod_obra) {
      revalidateTag(`obra-${data.cod_obra}`)
      revalidateTag(`ordenes-obra-${data.cod_obra}`)
    }
    revalidatePath('/produccion')
    revalidatePath('/coordinacion/ordenes-produccion')

    return { success: true, data }
  } catch (error) {
    const message =
      error instanceof Error ? error.message : 'Error al finalizar producción'
    console.error('[finishProduccion]', message)
    return { success: false, error: message }
  }
}

// Alias para compatibilidad
export const crearOrdenProduccion = createOrdenProduccion

/**
 * Updates an orden de produccion with a new PDF file
 * @param {number} cod_op - Orden de produccion code/ID
 * @param {FormData} formData - Form data with PDF file
 * @returns {Promise<{success: boolean, data?: OrdenProduccion, error?: string}>} Operation result
 */
export async function updateOrdenProduccion(
  cod_op: number,
  formData: FormData
): Promise<ActionResponse<OrdenProduccion>> {
  try {
    const file = formData.get('file') as File

    if (!file || file.size === 0) {
      return { success: false, error: 'Debe seleccionar un archivo' }
    }

    if (file.type !== 'application/pdf') {
      return { success: false, error: 'Solo se permiten archivos PDF' }
    }

    const backendFormData = new FormData()
    backendFormData.append('file', file)

    const token = await getAccessToken()

    const response = await fetchWithErrorHandling(`${BASE_URL}/${cod_op}`, {
      method: 'PATCH',
      headers: {
        Authorization: `Bearer ${token}`,
      },
      body: backendFormData,
    })

    const wrapper = await response.json()
    const data = wrapper.data || wrapper
    revalidateTag('ordenes-produccion')
    revalidateTag('notas-fabrica')
    revalidateTag(`orden-${cod_op}`)
    revalidatePath('/produccion')
    revalidatePath('/coordinacion/ordenes-produccion')

    return { success: true, data }
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Error desconocido'
    console.error('[updateOrdenProduccion]', message)
    return { success: false, error: message }
  }
}

/**
 * Rejects a production order with a reason
 * @param {number} cod_op - Orden de produccion code/ID
 * @param {string} motivo - Reason for rejection
 * @returns {Promise<{success: boolean, data?: OrdenProduccion, error?: string}>} Operation result
 */
export async function rejectOrdenProduccion(
  cod_op: number,
  motivo: string
): Promise<ActionResponse<OrdenProduccion>> {
  try {
    const token = await getAccessToken()
    const response = await fetchWithErrorHandling(
      `${BASE_URL}/${cod_op}/rechazar`,
      {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ motivo }),
      }
    )

    const data = await response.json()
    revalidateTag('ordenes-produccion')
    revalidatePath('/coordinacion/ordenes-produccion')
    revalidatePath('/produccion')

    return { success: true, data }
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Error desconocido'
    console.error('[rejectOrdenProduccion]', message)
    return { success: false, error: message }
  }
}
