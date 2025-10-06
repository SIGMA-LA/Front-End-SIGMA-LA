'use server'

import { cookies } from 'next/headers'
import { Visita } from '@/types'

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

export async function obtenerVisitas(): Promise<Visita[]> {
  try {
    const token = await getAccessToken()

    console.log('Using API URL:', baseUrl)

    const response = await fetch(`${baseUrl}/visitas`, {
      method: 'GET',
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
    })

    if (!response.ok) {
      if (response.status === 401) {
        throw new Error('Token expirado. Por favor, inicia sesión nuevamente.')
      }
      const errorText = await response.text()
      throw new Error(
        `Error al cargar las visitas: ${response.status} - ${errorText}`
      )
    }

    const data = await response.json()
    return data
  } catch (error) {
    console.error('Error en obtenerVisitas:', error)
    throw error
  }
}

export async function crearVisita(
  visitaData: Omit<Visita, 'cod_visita'>
): Promise<Visita> {
  try {
    const token = await getAccessToken()

    const response = await fetch(`${baseUrl}/visitas`, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(visitaData),
    })

    if (!response.ok) {
      if (response.status === 401) {
        throw new Error('Token expirado. Por favor, inicia sesión nuevamente.')
      }
      throw new Error('Error al crear la visita')
    }

    const data = await response.json()
    return data
  } catch (error) {
    console.error('Error en crearVisita:', error)
    throw error
  }
}
