'use server'

import { fetchWithErrorHandling } from '@/lib/fetchWithErrorHandling'
import { getAccessToken } from './auth'

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000/api'
const BASE_URL = `${API_URL}/parametros`

export interface ParametroViatico {
  viatico_dia_persona: number
}

/**
 * Retrieves the current viatico parameter value
 * @returns {Promise<ParametroViatico>} Current viatico per person per day
 */
export async function getActualViatico(): Promise<ParametroViatico> {
  try {
    const token = await getAccessToken()
    const res = await fetchWithErrorHandling(`${BASE_URL}/actual/viatico`, {
      headers: { Authorization: `Bearer ${token}` },
      next: { revalidate: 3600, tags: ['parametros', 'viatico'] }, // 1 hour cache
    })
    return await res.json()
  } catch (error: any) {
    if (error.message !== 'Not found') {
      console.error('[getActualViatico]', error)
    }
    return { viatico_dia_persona: 50000 }
  }
}
