'use server'

import { revalidatePath } from 'next/cache'
import { fetchWithErrorHandling } from '@/lib/fetchWithErrorHandling'
import { getAccessToken } from './auth'
import type { Empleado } from '@/types'
import type { ActionResponse } from '@/types/actions'

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000/api'
const BASE_URL = `${API_URL}/empleados`

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
 */
export async function getVisitadores(): Promise<Empleado[]> {
  try {
    const token = await getAccessToken()
    const res = await fetchWithErrorHandling<Empleado[]>(`${BASE_URL}/visitadores`, {
      method: 'GET',
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
      next: { revalidate: 30, tags: ['empleados', 'visitadores'] },
    })
    return await res.json()
  } catch (error) {
    console.error('[getVisitadores]', error)
    return []
  }
}

/**
 * Retrieves Empleados available for delivery assignments
 */
export async function getEmpleadosDisponiblesEntrega(): Promise<Empleado[]> {
  try {
    const token = await getAccessToken()
    const res = await fetchWithErrorHandling<Empleado[]>(
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
    return await res.json()
  } catch (error) {
    console.error('[getEmpleadosDisponiblesEntrega]', error)
    return []
  }
}

/**
 * Searches Empleados by query parameters
 */
export async function searchEmpleados(query: string): Promise<Empleado[]> {
  try {
    const token = await getAccessToken()
    const res = await fetchWithErrorHandling<Empleado[]>(`${BASE_URL}/buscar?${query}`, {
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
 */
export async function getEmpleado(cuil: string): Promise<Empleado | null> {
  if (!cuil) return null

  try {
    const cuilNormalized = cuil.replace(/-/g, '')
    const token = await getAccessToken()
    const res = await fetchWithErrorHandling<Empleado>(`${BASE_URL}/${cuilNormalized}`, {
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
 */
export async function getEmpleados(): Promise<Empleado[]> {
  try {
    const token = await getAccessToken()
    const res = await fetchWithErrorHandling<Empleado[]>(BASE_URL, {
      method: 'GET',
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
      next: { revalidate: 30, tags: ['empleados'] },
    })
    return await res.json()
  } catch (error) {
    console.error('[getEmpleados]', error)
    return []
  }
}

/**
 * Creates a new Empleado
 */
export async function createEmpleado(
  empleadoData: CreateEmpleadoData
): Promise<ActionResponse<Empleado>> {
  try {
    const payload = { ...empleadoData, cuil: empleadoData.cuil.replace(/-/g, '') }
    const token = await getAccessToken()
    const res = await fetchWithErrorHandling<Empleado>(BASE_URL, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(payload),
    })

    const data = await res.json()

    revalidatePath('/admin/empleados')
    revalidatePath('/coordinacion/empleados')

    return { success: true, data }
  } catch (error) {
    const message = error instanceof Error ? error.message : 'No se pudo crear el empleado. Intentá nuevamente.'
    console.error('[createEmpleado]', message)
    return { success: false, error: message }
  }
}

/**
 * Updates an existing Empleado
 */
export async function updateEmpleado(
  cuil: string,
  empleadoData: UpdateEmpleadoData
): Promise<ActionResponse<Empleado>> {
  try {
    const cuilNormalized = cuil.replace(/-/g, '')
    const token = await getAccessToken()
    const res = await fetchWithErrorHandling<Empleado>(`${BASE_URL}/${cuilNormalized}`, {
      method: 'PUT',
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(empleadoData),
    })

    const data = await res.json()

    revalidatePath('/admin/empleados')
    revalidatePath('/coordinacion/empleados')
    revalidatePath(`/admin/empleados/${cuil}`)

    return { success: true, data }
  } catch (error) {
    const message = error instanceof Error ? error.message : 'No se pudo actualizar el empleado. Intentá nuevamente.'
    console.error('[updateEmpleado]', message)
    return { success: false, error: message }
  }
}

/**
 * Deletes an Empleado by CUIL
 */
export async function deleteEmpleado(
  cuil: string
): Promise<ActionResponse> {
  try {
    const cuilNormalized = cuil.replace(/-/g, '')
    const token = await getAccessToken()
    await fetchWithErrorHandling(`${BASE_URL}/${cuilNormalized}`, {
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
    const message = error instanceof Error ? error.message : 'No se pudo eliminar el empleado. Intentá nuevamente.'
    console.error('[deleteEmpleado]', message)
    return { success: false, error: message }
  }
}
