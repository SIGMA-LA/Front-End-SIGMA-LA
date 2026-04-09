'use server'

import { revalidatePath } from 'next/cache'
import { fetchWithErrorHandling } from '@/lib/fetchWithErrorHandling'
import { getAccessToken } from './auth'
import type { Cliente, PaginatedResponse } from '@/types'
import type { ActionResponse } from '@/types/actions'
export type { ActionResponse }

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000/api'
const BASE_URL = API_URL.endsWith('/clientes') ? API_URL : `${API_URL}/clientes`

function mapDeleteClienteError(error: unknown): string {
  const fallback = 'Error al eliminar el cliente'

  if (!(error instanceof Error)) {
    return fallback
  }

  const raw = error.message || ''
  const normalized = raw.toLowerCase()

  const hasAssociationHint =
    normalized.includes('foreign key') ||
    normalized.includes('constraint') ||
    normalized.includes('referenc') ||
    normalized.includes('asociad') ||
    normalized.includes('dependen') ||
    normalized.includes('obra') ||
    normalized.includes('visita')

  if (hasAssociationHint) {
    return 'No se puede eliminar este cliente porque tiene obras o visitas asociadas. Si la visita inicial no tiene obra, también debe desvincularse antes de eliminar el cliente.'
  }

  return raw || fallback
}

/**
 * Retrieves all Clientes or searches Clientes by filter
 * @param {string} filter - Optional search query
 * @returns {Promise<Cliente[]>} List of Clientes
 */
export async function getClientes(
  filter?: string,
  page: number = 1,
  pageSize: number = 10
): Promise<PaginatedResponse<Cliente>> {
  const emptyResponse: PaginatedResponse<Cliente> = {
    data: [], total: 0, totalPages: 0, page, pageSize,
  }

  try {
    const token = await getAccessToken()
    const params = new URLSearchParams()
    
    if (filter?.trim()) params.append('q', filter.trim())
    params.append('page', String(page))
    params.append('pageSize', String(pageSize))

    const url = `${BASE_URL}?${params.toString()}`

    const res = await fetchWithErrorHandling<PaginatedResponse<Cliente>>(url, {
      method: 'GET',
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
      next: { revalidate: 30, tags: ['clientes'] }
    })

    const data = await res.json()
    if (data && typeof data === 'object' && 'data' in data && Array.isArray(data.data)) {
      return data as PaginatedResponse<Cliente>
    }

    return emptyResponse
  } catch (error) {
    console.error('[getClientes]', error)
    return emptyResponse
  }
}

/**
 * Retrieves a single Cliente by CUIL
 * @param {string} cuil - Cliente CUIL identifier
 * @returns {Promise<Cliente | null>} Cliente data or null if not found
 */
export async function getCliente(cuil: string): Promise<Cliente | null> {
  if (!cuil) return null
  try {
    const token = await getAccessToken()
    const res = await fetchWithErrorHandling<Cliente>(
      `${BASE_URL}/${encodeURIComponent(cuil)}`,
      {
        method: 'GET',
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      }
    )

    return await res.json()
  } catch (error) {
    console.error('[getCliente]', error)
    return null
  }
}

/**
 * Creates a new Cliente
 * @param {FormData} formData - Cliente data
 * @returns {Promise<ActionResponse<Cliente>>} Operation result
 */
export async function createCliente(
  formData: FormData
): Promise<ActionResponse<Cliente>> {
  try {
    const token = await getAccessToken()
    const payload = Object.fromEntries(formData.entries())

    const res = await fetchWithErrorHandling<Cliente>(BASE_URL, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(payload),
    })

    const data = await res.json()

    revalidatePath('/admin/clientes')
    revalidatePath('/coordinacion/clientes')
    revalidatePath('/ventas/clientes')

    return { success: true, data }
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Error al crear el cliente'
    console.error('[createCliente]', message)
    return { success: false, error: message }
  }
}

/**
 * Updates an existing Cliente
 * @param {string} cuil - Cliente CUIL identifier
 * @param {FormData} formData - Updated cliente data
 * @returns {Promise<ActionResponse<Cliente>>} Operation result
 */
export async function updateCliente(
  cuil: string,
  formData: FormData
): Promise<ActionResponse<Cliente>> {
  if (!cuil) return { success: false, error: 'CUIL inválido' }
  try {
    const token = await getAccessToken()
    const payload = Object.fromEntries(formData.entries())

    const res = await fetchWithErrorHandling<Cliente>(
      `${BASE_URL}/${encodeURIComponent(cuil)}`,
      {
        method: 'PUT',
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload),
      }
    )

    const data = await res.json()

    revalidatePath('/admin/clientes')
    revalidatePath('/coordinacion/clientes')
    revalidatePath('/ventas/clientes')

    return { success: true, data }
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Error al actualizar el cliente'
    console.error('[updateCliente]', message)
    return { success: false, error: message }
  }
}

/**
 * Deletes a cliente by CUIL
 * @param {string} cuil - Cliente CUIL identifier
 * @returns {Promise<ActionResponse>} Operation result
 */
export async function deleteCliente(
  cuil: string
): Promise<ActionResponse> {
  if (!cuil) return { success: false, error: 'CUIL inválido' }
  try {
    const token = await getAccessToken()
    await fetchWithErrorHandling(`${BASE_URL}/${encodeURIComponent(cuil)}`, {
      method: 'DELETE',
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
    })

    revalidatePath('/admin/clientes')
    revalidatePath('/coordinacion/clientes')
    revalidatePath('/ventas/clientes')

    return { success: true }
  } catch (error) {
    const message = mapDeleteClienteError(error)
    console.error('[deleteCliente]', message)
    return { success: false, error: message }
  }
}
