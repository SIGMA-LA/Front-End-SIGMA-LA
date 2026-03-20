'use server'

import { revalidatePath } from 'next/cache'
import { fetchWithErrorHandling } from '@/lib/fetchWithErrorHandling'
import { getAccessToken } from './auth'
import type { Cliente, Obra } from '@/types'

export interface ActionResponse {
  success: boolean
  error?: string
  data?: Cliente
}

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000/api'
const BASE_URL = API_URL.endsWith('/clientes') ? API_URL : `${API_URL}/clientes`

/**
 * Retrieves all Clientes or searches Clientes by filter
 * @param {string} filter - Optional search query
 * @returns {Promise<Cliente[]>} List of Clientes
 */
export async function getClientes(filter?: string): Promise<Cliente[]> {
  try {
    const token = await getAccessToken()
    const url = filter?.trim()
      ? `${BASE_URL}/buscar?q=${encodeURIComponent(filter.trim())}`
      : BASE_URL

    const res = await fetchWithErrorHandling(url, {
      method: 'GET',
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
    })

    return (await res.json()) as Cliente[]
  } catch (error) {
    console.error('[getClientes]', error)
    return []
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
    const res = await fetchWithErrorHandling(
      `${BASE_URL}/${encodeURIComponent(cuil)}`,
      {
        method: 'GET',
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      }
    )

    return (await res.json()) as Cliente
  } catch (error) {
    console.error('[getCliente]', error)
    return null
  }
}

/**
 * Creates a new Cliente
 * @param {FormData} formData - Cliente data
 * @returns {Promise<ActionResponse>} Operation result
 */
export async function createCliente(
  formData: FormData
): Promise<ActionResponse> {
  try {
    const token = await getAccessToken()
    const payload = Object.fromEntries(formData.entries())

    const res = await fetchWithErrorHandling(BASE_URL, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(payload),
    })

    const data = await res.json()

    revalidatePath('/coordinacion/clientes')
    revalidatePath('/ventas/clientes')

    return { success: true, data }
  } catch (error) {
    console.error('[createCliente]', error)
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Error al crear el cliente',
    }
  }
}

/**
 * Updates an existing Cliente
 * @param {string} cuil - Cliente CUIL identifier
 * @param {FormData} formData - Updated cliente data
 * @returns {Promise<ActionResponse>} Operation result
 */
export async function updateCliente(
  cuil: string,
  formData: FormData
): Promise<ActionResponse> {
  if (!cuil) return { success: false, error: 'CUIL inválido' }
  try {
    const token = await getAccessToken()
    const payload = Object.fromEntries(formData.entries())

    const res = await fetchWithErrorHandling(
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

    revalidatePath('/coordinacion/clientes')
    revalidatePath('/ventas/clientes')

    return { success: true, data }
  } catch (error) {
    console.error('[updateCliente]', error)
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Error al actualizar el cliente',
    }
  }
}

/**
 * Deletes a cliente by CUIL
 * @param {string} cuil - Cliente CUIL identifier
 * @returns {Promise<{success: boolean, error?: string}>} Operation result
 */
export async function deleteCliente(
  cuil: string
): Promise<{ success: boolean; error?: string }> {
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

    revalidatePath('/coordinacion/clientes')
    revalidatePath('/ventas/clientes')

    return { success: true }
  } catch (error) {
    console.error('[deleteCliente]', error)
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Error al eliminar el cliente',
    }
  }
}

/**
 * Retrieves all construction sites (obras) for a specific cliente
 * @param {string} cuil - Cliente CUIL identifier
 * @returns {Promise<Obra[]>} List of Obras
 */
export async function getClienteObras(cuil: string): Promise<Obra[]> {
  if (!cuil) return []
  try {
    const token = await getAccessToken()
    const res = await fetchWithErrorHandling(
      `${BASE_URL}/${encodeURIComponent(cuil)}/obras`,
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
