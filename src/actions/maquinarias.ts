'use server'

import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'
import { fetchWithErrorHandling } from '@/lib/fetchWithErrorHandling'
import { getAccessToken } from './auth'
import type { Maquinaria, MaquinariaConDisponibilidad } from '@/types'
import type { ActionResponse } from '@/types/actions'

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000/api'
const BASE_URL = `${API_URL}/maquinarias`

/**
 * Retrieves all maquinarias from the system
 * @returns {Promise<Maquinaria[]>} List of all maquinarias
 */
export async function getMaquinarias(search?: string): Promise<Maquinaria[]> {
  const token = await getAccessToken()
  const url = search ? `${BASE_URL}?search=${encodeURIComponent(search)}` : BASE_URL
  const res = await fetchWithErrorHandling<Maquinaria[]>(url, {
    headers: { Authorization: `Bearer ${token}` },
    next: { revalidate: 30, tags: ['maquinarias'] },
  })
  return res.json()
}

/**
 * Retrieves all available maquinarias (not currently assigned)
 * @returns {Promise<Maquinaria[]>} List of available maquinarias
 */
export async function getMaquinariasDisponibles(): Promise<Maquinaria[]> {
  const token = await getAccessToken()
  const res = await fetchWithErrorHandling<Maquinaria[]>(`${BASE_URL}/disponibles`, {
    headers: { Authorization: `Bearer ${token}` },
    next: { revalidate: 30, tags: ['maquinarias', 'maquinarias-disponibles'] },
  })
  return res.json()
}

/**
 * Retrieves maquinarias availability status for a date range
 * @param {string} fechaInicioISO - Start date in ISO format
 * @param {string} fechaFinISO - End date in ISO format
 * @returns {Promise<MaquinariaConDisponibilidad[]>} List of maquinarias with availability status
 */
export async function getDisponibilidadMaquinarias(
  fechaInicioISO: string,
  fechaFinISO: string
): Promise<MaquinariaConDisponibilidad[]> {
  const token = await getAccessToken()
  const params = new URLSearchParams({
    fecha_hora_inicio: fechaInicioISO,
    fecha_hora_fin: fechaFinISO,
  })
  const res = await fetchWithErrorHandling<MaquinariaConDisponibilidad[]>(
    `${BASE_URL}/disponibilidad?${params}`,
    {
      headers: { Authorization: `Bearer ${token}` },
      next: { revalidate: 30, tags: ['maquinarias-disponibilidad'] },
    }
  )
  return res.json()
}

/**
 * Retrieves a single maquinaria by ID
 * @param {number} id - Maquinaria ID
 * @returns {Promise<Maquinaria>} Maquinaria data
 */
export async function getMaquinaria(id: number): Promise<Maquinaria> {
  const token = await getAccessToken()
  const res = await fetchWithErrorHandling<Maquinaria>(`${BASE_URL}/${id}`, {
    headers: { Authorization: `Bearer ${token}` },
    next: { revalidate: 30, tags: [`maquinaria-${id}`] },
  })
  return res.json()
}

/**
 * Creates a new maquinaria and redirects to the list
 * @param {Partial<Maquinaria>} data - Maquinaria data
 */
export async function createMaquinaria(
  data: Partial<Maquinaria>
): Promise<ActionResponse<Maquinaria>> {
  try {
    const token = await getAccessToken()
    const res = await fetchWithErrorHandling(BASE_URL, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    })

    const result = await res.json()
    revalidatePath('/coordinacion/maquinarias')
    return { success: true, data: result }
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Error creating Maquinaria'
    console.error('[createMaquinaria]', message)
    return { success: false, error: message }
  }
}

/**
 * Updates an existing maquinaria and redirects to the list
 * @param {number} id - Maquinaria ID
 * @param {Partial<Maquinaria>} data - Fields to update
 */
export async function updateMaquinaria(
  id: number,
  data: Partial<Maquinaria>
): Promise<ActionResponse<Maquinaria>> {
  try {
    const token = await getAccessToken()
    const res = await fetchWithErrorHandling(`${BASE_URL}/${id}`, {
      method: 'PUT',
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    })

    const result = await res.json()
    revalidatePath('/coordinacion/maquinarias')
    return { success: true, data: result }
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Error updating Maquinaria'
    console.error('[updateMaquinaria]', message)
    return { success: false, error: message }
  }
}

/**
 * Deletes a maquinaria
 * @param {number} id - Maquinaria ID
 * @returns {Promise<{success: boolean}>} Operation result
 */
export async function deleteMaquinaria(id: number): Promise<ActionResponse> {
  try {
    const token = await getAccessToken()
    await fetchWithErrorHandling(`${BASE_URL}/${id}`, {
      method: 'DELETE',
      headers: { Authorization: `Bearer ${token}` },
    })

    revalidatePath('/coordinacion/maquinarias')
    return { success: true }
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Error deleting Maquinaria'
    console.error('[deleteMaquinaria]', message)
    return { success: false, error: message }
  }
}
