'use server'

import { revalidatePath } from 'next/cache'
import { fetchWithErrorHandling } from '@/lib/fetchWithErrorHandling'
import { getAccessToken } from './auth'
import type { Cliente } from '@/types'

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
      next: { revalidate: 30, tags: ['clientes'] },
    })
    const data = await res.json()
    return Array.isArray(data) ? data : []
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
        next: { revalidate: 30, tags: [`cliente-${cuil}`] },
      }
    )
    return await res.json()
  } catch (error) {
    console.error('[getCliente]', error)
    return null
  }
}
/**
 * Creates a new Cliente from form data
 * @param {FormData} formData - Cliente data from form submission
 * @returns {Promise<{success: boolean, data?: Cliente, error?: string}>} Operation result
 */
export async function createCliente(
  formData: FormData | any
): Promise<{ success: boolean; error?: string; data?: Cliente }> {
  try {
    const token = await getAccessToken()

    // Si ya es un objeto plano (desde useActionState), lo usamos directamente
    const raw =
      formData instanceof FormData
        ? Object.fromEntries(formData.entries())
        : formData

    const clienteData: Record<string, string> = {}
    for (const [key, val] of Object.entries(raw)) {
      if (typeof val === 'string') {
        clienteData[key] = val.trim()
      } else if (val !== null && val !== undefined) {
        clienteData[key] = String(val).trim()
      }
    }

    // Validate CUIL
    if (!clienteData.cuil) {
      return { success: false, error: 'CUIL is required' }
    }

    const cuilDigits = clienteData.cuil.replace(/\D/g, '')
    if (cuilDigits.length !== 11) {
      return { success: false, error: 'Invalid CUIL (must have 11 digits)' }
    }
    clienteData.cuil = cuilDigits

    // Validate by cliente type
    if (clienteData.tipo_cliente === 'EMPRESA' && !clienteData.razon_social) {
      return {
        success: false,
        error: 'Business name is required for companies',
      }
    }

    if (clienteData.tipo_cliente === 'PERSONA') {
      if (!clienteData.nombre || !clienteData.apellido) {
        return { success: false, error: 'First and last name are required' }
      }
      if (!clienteData.sexo) {
        return { success: false, error: 'Gender is required' }
      }
    }

    const payload = {
      cuil: clienteData.cuil,
      tipo_cliente: clienteData.tipo_cliente,
      telefono: clienteData.telefono,
      mail: clienteData.mail,
      razon_social: clienteData.razon_social || null,
      nombre: clienteData.nombre || null,
      apellido: clienteData.apellido || null,
      sexo: clienteData.sexo || null,
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

    revalidatePath('/coordinacion/clientes')
    revalidatePath('/ventas/clientes')

    return { success: true, data }
  } catch (error) {
    console.error('[createCliente]', error)
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Error creating client',
    }
  }
}

/**
 * Updates an existing cliente
 * @param {string} cuil - Cliente CUIL identifier
 * @param {Partial<Cliente>} clienteData - Fields to update
 * @returns {Promise<Cliente | null>} Updated cliente or null on failure
 */
export async function updateCliente(
  cuil: string,
  clienteData: Partial<Cliente>
): Promise<Cliente | null> {
  if (!cuil) return null
  try {
    const token = await getAccessToken()
    const res = await fetchWithErrorHandling(
      `${BASE_URL}/${encodeURIComponent(cuil)}`,
      {
        method: 'PUT',
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(clienteData),
      }
    )
    const data = await res.json()

    revalidatePath('/coordinacion/clientes')
    revalidatePath('/ventas/clientes')

    return data
  } catch (error) {
    console.error('[updateCliente]', error)
    return null
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
  if (!cuil) return { success: false, error: 'Invalid CUIL' }
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
      error: error instanceof Error ? error.message : 'Unknown error',
    }
  }
}

/**
 * Retrieves all construction sites (obras) for a specific cliente
 * @param {string} cuil - Cliente CUIL identifier
 * @returns {Promise<any[]>} List of cliente obras
 */
export async function getClienteObras(cuil: string): Promise<any[]> {
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
        next: { revalidate: 30, tags: [`cliente-${cuil}-obras`] },
      }
    )
    const data = await res.json()
    return Array.isArray(data) ? data : []
  } catch (error) {
    console.error('[getClienteObras]', error)
    return []
  }
}
