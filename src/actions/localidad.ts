'use server'

import { fetchWithErrorHandling } from '@/lib/fetchWithErrorHandling'
import { getAccessToken } from './auth'
import type { Localidad, Provincia } from '@/types'

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000/api'
const BASE_URL = `${API_URL}/provincias`

/**
 * Retrieves all provincias from the system
 * @returns {Promise<Provincia[]>} List of provincias
 */
export async function getProvincias(): Promise<Provincia[]> {
  try {
    const token = await getAccessToken()
    const res = await fetchWithErrorHandling(BASE_URL, {
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
 * @param {number} cod_provincia - Provincia code/ID
 * @returns {Promise<Provincia | null>} Provincia data or null if not found
 */
export async function getProvincia(
  cod_provincia: number
): Promise<Provincia | null> {
  try {
    const token = await getAccessToken()
    const res = await fetchWithErrorHandling(`${BASE_URL}/${cod_provincia}`, {
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
 * @param {number} cod_provincia - Provincia code/ID
 * @returns {Promise<Localidad[]>} List of localidades in the provincia
 */
export async function getLocalidadesByProvincia(
  cod_provincia: number
): Promise<Localidad[]> {
  try {
    const token = await getAccessToken()
    const res = await fetchWithErrorHandling(
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
