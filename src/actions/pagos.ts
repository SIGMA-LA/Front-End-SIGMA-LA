'use server'

import { revalidatePath } from 'next/cache'
import { fetchWithErrorHandling } from '@/lib/fetchWithErrorHandling'
import { getAccessToken } from './auth'
import type { Pago, PagosFilter, ObraConPresupuesto } from '@/types'
import type { ActionResponse } from '@/types/actions'

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000/api'
const BASE_URL = API_URL.endsWith('/pagos') ? API_URL : `${API_URL}/pagos`

/**
 * Retrieves pagos with optional filters
 * @param {PagosFilter} filters - Optional filters (cliente, fechaDesde, fechaHasta, obra, montoMin, montoMax)
 * @returns {Promise<Pago[]>} List of pagos matching filters
 */
export async function getPagos(filters?: PagosFilter): Promise<Pago[]> {
  try {
    const token = await getAccessToken()

    // Build query params
    const params = new URLSearchParams()
    if (filters?.search) params.append('search', filters.search)
    if (filters?.cliente) params.append('cliente', filters.cliente)
    if (filters?.fechaDesde) params.append('fechaDesde', filters.fechaDesde)
    if (filters?.fechaHasta) params.append('fechaHasta', filters.fechaHasta)
    if (filters?.obra) params.append('obra', filters.obra)
    if (filters?.montoMin !== undefined)
      params.append('montoMin', filters.montoMin.toString())
    if (filters?.montoMax !== undefined)
      params.append('montoMax', filters.montoMax.toString())

    const queryString = params.toString()
    const url = `${BASE_URL}${queryString ? `?${queryString}` : ''}`

    const response = await fetchWithErrorHandling<Pago[]>(url, {
      method: 'GET',
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
      next: { revalidate: 30, tags: ['pagos'] },
    })
    return await response.json()
  } catch (error) {
    console.error('[getPagos]', error)
    throw error
  }
}

/**
 * Retrieves pagos for a specific obra
 * @param {number} cod_obra - Obra code/ID
 * @returns {Promise<Pago[]>} List of pagos for the obra
 */
export async function getPagosObra(cod_obra: number): Promise<Pago[]> {
  try {
    const token = await getAccessToken()
    const response = await fetchWithErrorHandling<Pago[]>(
      `${BASE_URL}/obra/${cod_obra}`,
      {
        method: 'GET',
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        next: { revalidate: 30, tags: ['pagos', `pagos-obra-${cod_obra}`] },
      }
    )
    return await response.json()
  } catch (error) {
    console.error('[getPagosObra]', error)
    throw error
  }
}

/**
 * Retrieves obras with accepted presupuesto (for creating pagos)
 * @param {string} search - Optional search query
 * @returns {Promise<ObraConPresupuesto[]>} List of obras with presupuesto
 */
export async function getObrasConPresupuestoAceptado(
  search?: string
): Promise<ObraConPresupuesto[]> {
  try {
    const token = await getAccessToken()

    const params = new URLSearchParams()
    if (search) params.append('search', search)

    const queryString = params.toString()
    const url = `${BASE_URL}/obras-con-presupuesto${queryString ? `?${queryString}` : ''}`

    const response = await fetchWithErrorHandling<ObraConPresupuesto[]>(url, {
      method: 'GET',
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
      next: { revalidate: 30, tags: ['obras-presupuesto'] },
    })

    const data = await response.json()

    // Filter only obras with pending balance
    const obrasFiltradas = data.filter((obra: ObraConPresupuesto) => {
      return (obra.saldoPendiente || 0) > 0
    })

    return obrasFiltradas
  } catch (error) {
    console.error('[getObrasConPresupuestoAceptado]', error)
    throw error
  }
}

/**
 * Checks if there are obras with pending payments
 * @returns {Promise<boolean>} True if there are obras with pending payments
 */
export async function hayObrasPendientes(): Promise<boolean> {
  try {
    const token = await getAccessToken()
    const response = await fetchWithErrorHandling<ObraConPresupuesto[]>(
      `${API_URL}/obras/con-presupuesto-aceptado?search=`,
      {
        method: 'GET',
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        next: { revalidate: 60, tags: ['obras-pendientes'] },
      }
    )

    const obras = await response.json()
    // Return true if there are obras with pending balance > 0
    return obras.some(
      (obra: ObraConPresupuesto) => (obra.saldoPendiente || 0) > 0
    )
  } catch (error) {
    console.error('[hayObrasPendientes]', error)
    throw error
  }
}

/**
 * Creates a new pago for a specific obra
 * @param {Object} pagoData - Pago data with monto
 * @param {number} cod_obra - Obra code/ID
 * @returns {Promise<Pago>} Created pago
 */
export async function createPagoForObra(
  pagoData: { monto: number },
  cod_obra: number
): Promise<ActionResponse<Pago>> {
  try {
    const token = await getAccessToken()
    const response = await fetchWithErrorHandling(
      `${BASE_URL}/obra/${cod_obra}`,
      {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(pagoData),
      }
    )

    const data = await response.json()
    revalidatePath('/ventas/pagos')
    revalidatePath('/ventas/obras')
    return { success: true, data }
  } catch (error) {
    const message =
      error instanceof Error
        ? error.message
        : 'No se pudo registrar el pago. Intentá nuevamente.'
    console.error('[createPagoForObra]', message)
    return { success: false, error: message }
  }
}

/**
 * Deletes a pago by code
 * @param {number} cod_pago - Pago code/ID
 * @returns {Promise<void>}
 */
export async function deletePago(cod_pago: number): Promise<ActionResponse> {
  try {
    const token = await getAccessToken()
    await fetchWithErrorHandling(`${BASE_URL}/${cod_pago}`, {
      method: 'DELETE',
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
    })

    revalidatePath('/ventas/pagos')
    revalidatePath('/ventas/obras')
    return { success: true }
  } catch (error) {
    const message =
      error instanceof Error
        ? error.message
        : 'No se pudo eliminar el pago. Intentá nuevamente.'
    console.error('[deletePago]', message)
    return { success: false, error: message }
  }
}
