'use server'

import { revalidatePath } from 'next/cache'
import { fetchWithErrorHandling } from '@/lib/fetchWithErrorHandling'
import { getAccessToken } from './auth'
import type { Localidad, Provincia, CreateLocalidadData } from '@/types'
import type { ActionResponse } from '@/types/actions'

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000/api'
const BASE_URL = `${API_URL}/provincias`
const LOCALIDADES_URL = `${API_URL}/localidades`

/**
 * Retrieves all provincias from the system
 */
export async function getProvincias(): Promise<Provincia[]> {
  try {
    const token = await getAccessToken()
    const res = await fetchWithErrorHandling<Provincia[]>(BASE_URL, {
      method: 'GET',
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
      next: { revalidate: 3600, tags: ['provincias'] }, // 1 hour cache
    })
    return await res.json()
  } catch (error) {
    console.error('[getProvincias]', error)
    return []
  }
}

/**
 * Retrieves a single provincia by ID
 */
export async function getProvincia(
  cod_provincia: number
): Promise<Provincia | null> {
  try {
    const token = await getAccessToken()
    const res = await fetchWithErrorHandling<Provincia>(`${BASE_URL}/${cod_provincia}`, {
      method: 'GET',
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
      next: { revalidate: 3600, tags: [`provincia-${cod_provincia}`] },
    })
    return await res.json()
  } catch (error) {
    console.error('[getProvincia]', error)
    return null
  }
}

/**
 * Retrieves all localidades belonging to a specific provincia
 */
export async function getLocalidadesByProvincia(
  cod_provincia: number
): Promise<Localidad[]> {
  try {
    const token = await getAccessToken()
    const res = await fetchWithErrorHandling<Localidad[]>(
      `${API_URL}/localidades/provincias/${cod_provincia}`,
      {
        method: 'GET',
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        next: {
          revalidate: 3600,
          tags: ['localidades', `localidades-provincia-${cod_provincia}`],
        },
      }
    )
    return await res.json()
  } catch (error) {
    console.error('[getLocalidadesByProvincia]', error)
    return []
  }
}

/**
 * Retrieves all localidades from the system
 */
export async function getLocalidades(): Promise<Localidad[]> {
  try {
    const token = await getAccessToken()
    const res = await fetchWithErrorHandling<Localidad[]>(LOCALIDADES_URL, {
      method: 'GET',
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
      next: { revalidate: 60, tags: ['localidades'] },
    })
    return await res.json()
  } catch (error) {
    console.error('[getLocalidades]', error)
    return []
  }
}

/**
 * Creates a new Localidad
 */
export async function createLocalidad(
  data: CreateLocalidadData,
): Promise<ActionResponse<Localidad>> {
  try {
    const token = await getAccessToken()
    const res = await fetchWithErrorHandling<Localidad>(LOCALIDADES_URL, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    })

    const createdLocalidad = await res.json()
    revalidatePath('/admin/localidades')

    return { success: true, data: createdLocalidad }
  } catch (error) {
    const message = error instanceof Error ? error.message : 'No se pudo crear la localidad. Intentá nuevamente.'
    console.error('[createLocalidad]', message)
    return { success: false, error: message }
  }
}

/**
 * Deletes a Localidad
 */
export async function deleteLocalidad(
  cod_localidad: number
): Promise<ActionResponse<void>> {
  try {
    const token = await getAccessToken()
    const res = await fetchWithErrorHandling<void>(`${LOCALIDADES_URL}/${cod_localidad}`, {
      method: 'DELETE',
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
    })

    if (res.status !== 204) {
      await res.json()
    }

    revalidatePath('/admin/localidades')

    return { success: true }
  } catch (error) {
    const message = error instanceof Error ? error.message : 'No se pudo eliminar la localidad. Intentá nuevamente.'
    console.error('[deleteLocalidad]', message)
    return { success: false, error: message }
  }
}
