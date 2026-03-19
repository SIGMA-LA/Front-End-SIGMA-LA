'use server'

import { revalidatePath } from 'next/cache'
import { fetchWithErrorHandling } from '@/lib/fetchWithErrorHandling'
import { getAccessToken } from './auth'

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000/api'
const BASE_URL = API_URL.endsWith('/empleados/configuraciones')
  ? API_URL
  : `${API_URL}/empleados/configuraciones`

export interface PerfilFormData {
  nombre: string;
  apellido: string;
  cuil: string;
}

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
    const response = await res.json()
    // Tu backend devuelve { success: true, data: { nombre, apellido, cuil } }
    return response.data || response
  } catch (error) {
    console.error('[getPerfilConfig]', error)
    throw error
  }
}

/**
 * Actualiza la configuración de perfil del usuario
 * @param {PerfilFormData} data - Nuevos datos del perfil
 * @returns {Promise<PerfilFormData>}
 */
export async function updatePerfilConfig(data: PerfilFormData): Promise<PerfilFormData> {
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
    
    // Dependiendo de si tu backend retorna un JSON de respuesta o solo un 200/204
    let result: any = {}
    if (res.status !== 204) {
      try {
        result = await res.json()
      } catch (e) {
        /* ignorar caso donde el cuerpo está vacío y falla el .json() */
      }
    }
    
    // Revalidad la ruta donde están las configuraciones
    revalidatePath('/configuraciones')
    
    // Extraer la data del wrapper { success, data } si existe
    const returnedData = result.data ? result.data : result

    return (Object.keys(returnedData).length > 0 ? returnedData : data) as PerfilFormData
  } catch (error) {
    console.error('[updatePerfilConfig]', error)
    throw error
  }
}

/**
 * Cambia la contraseña del usuario
 */
export async function changePasswordConfig(currentPass: string, newPass: string): Promise<any> {
  try {
    const token = await getAccessToken()
    const res = await fetchWithErrorHandling(`${BASE_URL}/password`, {
      method: 'PUT',
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ currentPassword: currentPass, newPassword: newPass }),
    })
    
    if (res.status === 204) return { success: true }
    return await res.json()
  } catch (error: any) {
    console.error('[changePasswordConfig]', error)
    // Extraer el mensaje del error que arroja fetchWithErrorHandling
    if (error.message) {
      try {
        const errorData = JSON.parse(error.message)
        throw new Error(errorData.message || 'Error al cambiar la contraseña')
      } catch (e) {
        throw new Error(error.message)
      }
    }
    throw error
  }
}
