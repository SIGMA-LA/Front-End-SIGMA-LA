'use server'

import { cookies } from 'next/headers'
import { Empleado } from '@/types'

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

export async function obtenerEmpleadoActual(): Promise<Empleado | null> {
  try {
    const token = await getAccessToken()
    const response = await fetch(`${baseUrl}/empleados/me`, {
      method: 'GET',
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
      cache: 'no-store',
    })

    if (!response.ok) {
      return null
    }

    const empleado: Empleado = await response.json()
    return empleado
  } catch (error) {
    console.error('Error obteniendo empleado actual:', error)
    return null
  }
}
