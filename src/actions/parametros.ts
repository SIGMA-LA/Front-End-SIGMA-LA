'use server'

import { fetchWithErrorHandling } from '@/lib/fetchWithErrorHandling'
import { getAccessToken } from './auth'
import { revalidatePath } from 'next/cache'
import type { ParametroViatico } from '@/types'

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000/api'
const BASE_URL = `${API_URL}/parametros`

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
    return (await res.json()) as ParametroViatico
  } catch (error: unknown) {
    if (error instanceof Error && error.message !== 'Not found') {
      console.error('[getActualViatico]', error)
    }
    return { viatico_dia_persona: 50000 }
  }
}

/**
 * Retrieves the actual parametro record
 */
export async function getActualParametros() {
  try {
    const token = await getAccessToken()
    const res = await fetchWithErrorHandling(`${BASE_URL}/actual`, {
      headers: { Authorization: `Bearer ${token}` },
      next: { revalidate: 3600, tags: ['parametros'] },
    })
    return await res.json()
  } catch (error: unknown) {
    console.error('[getActualParametros]', error)
    return null
  }
}

/**
 * Creates a new parametro record
 */
export async function updateParametros(data: {
  dias_vigencia_presu: number
  viatico_dia_persona: number
  fecha_cambio: string
  hora_cambio: string
}) {
  try {
    const token = await getAccessToken()
    const res = await fetchWithErrorHandling(`${BASE_URL}`, {
      method: 'POST',
      headers: { 
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    })
    
    revalidatePath('/configuraciones')
    return { success: true, data: await res.json() }
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : 'Error al guardar los parámetros'
    console.error('[updateParametros]', message)
    return { success: false, error: message }
  }
}
