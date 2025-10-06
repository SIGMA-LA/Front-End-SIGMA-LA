'use server'

import { cookies } from 'next/headers'
import { Obra } from '@/types'

const baseUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000/api'

async function getAccessToken(): Promise<string> {
  const cookieStore = await cookies()
  let accessToken = cookieStore.get('accessToken')?.value

  if (accessToken) {
    return accessToken
  }
  const refreshToken = cookieStore.get('refreshToken')?.value

  if (!refreshToken) {
    throw new Error(
      'No hay tokens disponibles. Por favor, inicia sesión nuevamente.'
    )
  }

  try {
    const response = await fetch(`${baseUrl}/auth/refresh`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ refreshToken }),
    })

    if (!response.ok) {
      throw new Error('Error al renovar el token de acceso')
    }

    const data = await response.json()
    return data.token || data.accessToken
  } catch (error) {
    console.error('Error renovando token:', error)
    throw new Error('Sesión expirada. Por favor, inicia sesión nuevamente.')
  }
}
export async function deleteObra(
  id: number
): Promise<{ success: boolean; error?: string }> {
  try {
    const token = await getAccessToken()
    const response = await fetch(`${baseUrl}/obras/${id}`, {
      method: 'DELETE',
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
    })
    if (!response.ok) {
      if (response.status === 401) {
        throw new Error('Token expirado. Por favor, inicia sesión nuevamente.')
      } else if (response.status === 404) {
        throw new Error('Obra no encontrada.')
      }
      throw new Error('Error al eliminar la obra.')
    }
    return { success: true }
  } catch (error: unknown) {
    console.error('Error al eliminar la obra:', error)
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Error desconocido',
    }
  }
}
