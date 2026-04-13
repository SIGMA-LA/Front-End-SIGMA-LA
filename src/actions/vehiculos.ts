'use server'

import { revalidatePath } from 'next/cache'
import { fetchWithErrorHandling } from '@/lib/fetchWithErrorHandling'
import { getAccessToken } from './auth'
import type {
  Vehiculo,
  VehiculoFormData,
  VehiculoConDisponibilidad,
} from '@/types'
import type { ActionResponse } from '@/types/actions'

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000/api'
const BASE_URL = API_URL.endsWith('/vehiculos')
  ? API_URL
  : `${API_URL}/vehiculos`

/**
 * Retrieves all vehiculos
 * @returns {Promise<Vehiculo[]>} List of all vehiculos
 */
export async function getVehiculos(search?: string): Promise<Vehiculo[]> {
  try {
    const token = await getAccessToken()
    const url = search
      ? `${BASE_URL}?search=${encodeURIComponent(search)}`
      : BASE_URL
    const res = await fetchWithErrorHandling<Vehiculo[]>(url, {
      method: 'GET',
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
      next: { revalidate: 30, tags: ['vehiculos'] },
    })
    return await res.json()
  } catch (error) {
    console.error('[getVehiculos]', error)
    throw error
  }
}

/**
 * Retrieves a single vehiculo by patente
 * @param {string} patente - Vehiculo patent/ID
 * @returns {Promise<Vehiculo>} Vehiculo data
 */
export async function getVehiculo(patente: string): Promise<Vehiculo> {
  try {
    const token = await getAccessToken()
    const res = await fetchWithErrorHandling<Vehiculo>(
      `${BASE_URL}/${patente}`,
      {
        method: 'GET',
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        next: { revalidate: 30, tags: ['vehiculos', `vehiculo-${patente}`] },
      }
    )
    const data = await res.json()
    return data
  } catch (error) {
    console.error('[getVehiculo]', error)
    throw error
  }
}

/**
 * Retrieves available vehiculos (not assigned to deliveries)
 * @returns {Promise<Vehiculo[]>} List of available vehiculos
 */
export async function getVehiculosDisponibles(): Promise<Vehiculo[]> {
  try {
    const token = await getAccessToken()
    const res = await fetchWithErrorHandling<Vehiculo[]>(
      `${BASE_URL}/disponibles`,
      {
        method: 'GET',
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        next: { revalidate: 30, tags: ['vehiculos', 'vehiculos-disponibles'] },
      }
    )
    return await res.json()
  } catch (error) {
    console.error('[getVehiculosDisponibles]', error)
    return []
  }
}

/**
 * Retrieves vehiculos availability status for a date range
 * @param {string} fechaInicioISO - Start date in ISO format
 * @param {string} fechaFinISO - End date in ISO format
 * @returns {Promise<VehiculoConDisponibilidad[]>} List of vehiculos with availability status
 */
export async function getDisponibilidadVehiculos(
  fechaInicioISO: string,
  fechaFinISO: string
): Promise<VehiculoConDisponibilidad[]> {
  try {
    const token = await getAccessToken()
    const params = new URLSearchParams({
      fecha_hora_inicio: fechaInicioISO,
      fecha_hora_fin: fechaFinISO,
    })
    const res = await fetchWithErrorHandling<VehiculoConDisponibilidad[]>(
      `${BASE_URL}/disponibilidad?${params}`,
      {
        headers: { Authorization: `Bearer ${token}` },
        next: { revalidate: 30, tags: ['vehiculos-disponibilidad'] },
      }
    )
    return await res.json()
  } catch (error) {
    console.error('[getDisponibilidadVehiculos]', error)
    return []
  }
}

/**
 * Creates a new vehiculo
 * @param {VehiculoFormData} data - Vehiculo data
 * @returns {Promise<Vehiculo>} Created vehiculo
 */
export async function createVehiculo(
  data: VehiculoFormData
): Promise<ActionResponse<Vehiculo>> {
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
    const data_res = await res.json()
    revalidatePath('/coordinacion/vehiculos')
    return { success: true, data: data_res }
  } catch (error) {
    const message =
      error instanceof Error ? error.message : 'No se pudo crear el vehículo. Intentá nuevamente.'
    console.error('[createVehiculo]', message)
    return { success: false, error: message }
  }
}

/**
 * Updates a vehiculo by patente
 * @param {string} patente - Vehiculo patent/ID
 * @param {Partial<VehiculoFormData>} data - Partial vehiculo data to update
 * @returns {Promise<Vehiculo>} Updated vehiculo
 */
export async function updateVehiculo(
  patente: string,
  data: Partial<VehiculoFormData>
): Promise<ActionResponse<Vehiculo>> {
  try {
    const token = await getAccessToken()
    const res = await fetchWithErrorHandling(`${BASE_URL}/${patente}`, {
      method: 'PUT',
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    })
    const data_res = await res.json()
    revalidatePath('/coordinacion/vehiculos')
    return { success: true, data: data_res }
  } catch (error) {
    const message =
      error instanceof Error ? error.message : 'No se pudo actualizar el vehículo. Intentá nuevamente.'
    console.error('[updateVehiculo]', message)
    return { success: false, error: message }
  }
}

/**
 * Deletes a vehiculo by patente
 * @param {string} patente - Vehiculo patent/ID
 * @returns {Promise<void>}
 */
export async function deleteVehiculo(patente: string): Promise<ActionResponse> {
  try {
    const token = await getAccessToken()
    await fetchWithErrorHandling(`${BASE_URL}/${patente}`, {
      method: 'DELETE',
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
    })
    revalidatePath('/coordinacion/vehiculos')
    return { success: true }
  } catch (error) {
    const message =
      error instanceof Error ? error.message : 'No se pudo eliminar el vehículo. Intentá nuevamente.'
    console.error('[deleteVehiculo]', message)
    return { success: false, error: message }
  }
}
