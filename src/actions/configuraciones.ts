'use server'

import { revalidatePath } from 'next/cache'
import { fetchWithErrorHandling } from '@/lib/fetchWithErrorHandling'
import { getAccessToken } from './auth'
import type { PerfilFormData } from '@/types'
import type { ActionResponse } from '@/types/actions'

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000/api'
const BASE_URL = API_URL.endsWith('/empleados/configuraciones')
  ? API_URL
  : `${API_URL}/empleados/configuraciones`

/**
 * Obtiene la configuración de perfil del usuario
 * @returns {Promise<PerfilFormData>}
 */
export async function getPerfilConfig(): Promise<PerfilFormData> {
  try {
    const token = await getAccessToken()
    const res = await fetchWithErrorHandling(`${BASE_URL}/perfil`, {
      method: 'GET',
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
      next: { revalidate: 30, tags: ['configuraciones-perfil'] },
    })
    return (await res.json()) as PerfilFormData
  } catch (error) {
    console.error('[getPerfilConfig]', error)
    throw error
  }
}

/**
 * Actualiza la configuración de perfil del usuario
 * @param {PerfilFormData} data - Nuevos datos del perfil
 * @returns {Promise<ActionResponse<PerfilFormData>>}
 */
export async function updatePerfilConfig(data: PerfilFormData): Promise<ActionResponse<PerfilFormData>> {
  try {
    const token = await getAccessToken()
    const res = await fetchWithErrorHandling(`${BASE_URL}/perfil`, {
      method: 'PUT',
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    })
    
    let result: PerfilFormData | undefined
    if (res.status !== 204) {
      result = (await res.json()) as PerfilFormData
    }
    
    revalidatePath('/configuraciones')
    
    return { success: true, data: result || data }
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Error al actualizar el perfil'
    console.error('[updatePerfilConfig]', message)
    return { success: false, error: message }
  }
}

/**
 * Cambia la contraseña del usuario
 */
export async function changePasswordConfig(currentPass: string, newPass: string): Promise<ActionResponse> {
  try {
    const token = await getAccessToken()
    await fetchWithErrorHandling(`${BASE_URL}/password`, {
      method: 'PUT',
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ currentPassword: currentPass, newPassword: newPass }),
    })
    
    return { success: true }
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : 'Error al cambiar la contraseña'
    console.error('[changePasswordConfig]', message)
    return { success: false, error: message }
  }
}
