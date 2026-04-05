'use server'

import { revalidatePath } from 'next/cache'
import { fetchWithErrorHandling } from '@/lib/fetchWithErrorHandling'
import { getAccessToken } from './auth'
import type { Empleado } from '@/types'

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000/api'
const BASE_URL = `${API_URL}/empleados`

interface ApiResponse<T> {
  success: boolean
  data: T
}

interface CreateEmpleadoData {
  cuil: string
  nombre: string
  apellido: string
  rol_actual: string
  area_trabajo: string
  contrasenia?: string
}

interface UpdateEmpleadoData {
  nombre?: string
  apellido?: string
  rol_actual?: string
  area_trabajo?: string
  contrasenia?: string
}

/**
 * Retrieves all Empleados with visitador role
 * @returns {Promise<Empleado[]>} List of visitador Empleados
 */
export async function getVisitadores(): Promise<Empleado[]> {
  try {
    const token = await getAccessToken()
    const res = await fetchWithErrorHandling(`${BASE_URL}/visitadores`, {
      method: 'GET',
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
      next: { revalidate: 30, tags: ['empleados', 'visitadores'] },
    })
    const result = await res.json()
    return result
  } catch (error) {
    console.error('[getVisitadores]', error)
    return []
  }
}

/**
 * Retrieves Empleados available for delivery assignments
 * @returns {Promise<Empleado[]>} List of available Empleados
 */
export async function getEmpleadosDisponiblesEntrega(): Promise<Empleado[]> {
  try {
    const token = await getAccessToken()
    const res = await fetchWithErrorHandling(
      `${BASE_URL}/disponibles-entrega`,
      {
        method: 'GET',
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        next: { revalidate: 30, tags: ['empleados', 'disponibles-entrega'] },
      }
    )
    const result = await res.json()
    return result
  } catch (error) {
    console.error('[getEmpleadosDisponiblesEntrega]', error)
    return []
  }
}

/**
 * Searches Empleados by query parameters
 * @param {string} query - URL query string with filters (e.g., "rol=VISITADOR&area=VENTAS")
 * @returns {Promise<Empleado[]>} Filtered list of Empleados
 */
export async function searchEmpleados(query: string): Promise<Empleado[]> {
  try {
    const token = await getAccessToken()
    const res = await fetchWithErrorHandling(`${BASE_URL}/buscar?${query}`, {
      method: 'GET',
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
      next: { revalidate: 30, tags: ['empleados'] },
    })
    return await res.json()
  } catch (error) {
    console.error('[searchEmpleados]', error)
    return []
  }
}

/**
 * Retrieves a single Empleado by CUIL
 * @param {string} cuil - Empleado's CUIL identifier
 * @returns {Promise<Empleado | null>} Empleado data or null if not found
 */
export async function getEmpleado(cuil: string): Promise<Empleado | null> {
  if (!cuil) {
    console.error('[getEmpleado] Attempted to get Empleado without CUIL')
    return null
  }

  try {
    const token = await getAccessToken()
    const res = await fetchWithErrorHandling(`${BASE_URL}/${cuil}`, {
      method: 'GET',
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
      next: { revalidate: 30, tags: [`empleado-${cuil}`] },
    })
    return await res.json()
  } catch (error) {
    console.error(`[getEmpleado] CUIL: ${cuil}`, error)
    return null
  }
}

/**
 * Retrieves all Empleados in the system
 * @returns {Promise<Empleado[]>} Complete list of Empleados
 */
export async function getEmpleados(): Promise<Empleado[]> {
  try {
    const token = await getAccessToken()
    const res = await fetchWithErrorHandling(BASE_URL, {
      method: 'GET',
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
      next: { revalidate: 30, tags: ['empleados'] },
    })
    const data: Empleado[] = await res.json()
    return data || []
  } catch (error) {
    console.error('[getEmpleados]', error)
    return []
  }
}

/**
 * Creates a new Empleado
 * @param {CreateEmpleadoData} empleadoData - Empleado data
 * @returns {Promise<{success: boolean, data?: Empleado, error?: string}>} Operation result
 */
export async function createEmpleado(
  empleadoData: CreateEmpleadoData
): Promise<{ success: boolean; data?: Empleado; error?: string }> {
  try {
    const token = await getAccessToken()
    const res = await fetchWithErrorHandling(BASE_URL, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(empleadoData),
    })

    const empleado: Empleado = await res.json()

    revalidatePath('/admin/empleados')
    revalidatePath('/coordinacion/empleados')

    return { success: true, data: empleado }
  } catch (error) {
    console.error('[createEmpleado]', error)
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Error creating Empleado',
    }
  }
}

/**
 * Updates an existing Empleado
 * @param {string} cuil - Empleado's CUIL identifier
 * @param {UpdateEmpleadoData} empleadoData - Fields to update
 * @returns {Promise<{success: boolean, data?: Empleado, error?: string}>} Operation result
 */
export async function updateEmpleado(
  cuil: string,
  empleadoData: UpdateEmpleadoData
): Promise<{ success: boolean; data?: Empleado; error?: string }> {
  try {
    const token = await getAccessToken()
    const res = await fetchWithErrorHandling(`${BASE_URL}/${cuil}`, {
      method: 'PUT',
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(empleadoData),
    })

    const empleado: Empleado = await res.json()

    revalidatePath('/admin/empleados')
    revalidatePath('/coordinacion/empleados')
    revalidatePath(`/admin/empleados/${cuil}`)

    return { success: true, data: empleado }
  } catch (error) {
    console.error('[updateEmpleado]', error)
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Error updating Empleado',
    }
  }
}

/**
 * Deletes an Empleado by CUIL
 * @param {string} cuil - Empleado's CUIL identifier
 * @returns {Promise<{success: boolean, error?: string}>} Operation result
 */
export async function deleteEmpleado(
  cuil: string
): Promise<{ success: boolean; error?: string }> {
  try {
    const token = await getAccessToken()
    await fetchWithErrorHandling(`${BASE_URL}/${cuil}`, {
      method: 'DELETE',
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
    })

    revalidatePath('/admin/empleados')
    revalidatePath('/coordinacion/empleados')

    return { success: true }
  } catch (error) {
    console.error('[deleteEmpleado]', error)
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Error deleting Empleado',
    }
  }
}
