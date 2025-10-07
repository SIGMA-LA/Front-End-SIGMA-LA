'use server'

import { Empleado, Localidad } from '@/types'
import { getAccessToken } from './auth'

const baseUrl =
  process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000/api/localidades'

export async function obtenerLocalidades(): Promise<Localidad[]> {
  try {
    const token = await getAccessToken()
    const response = await fetch(`${baseUrl}`, {
      method: 'GET',
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
      cache: 'no-store',
    })

    if (!response.ok) {
      return []
    }

    const localidades: Localidad[] = await response.json()
    return localidades
  } catch (error) {
    console.error('Error obteniendo empleado actual:', error)
    return []
  }
}

export async function obtenerVisitadores(): Promise<Empleado[]> {
  try {
    const token = await getAccessToken()
    const response = await fetch(`${baseUrl}/visitadores`, {
      method: 'GET',
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
      cache: 'no-store',
    })

    if (!response.ok) {
      return []
    }

    const visitadores: Empleado[] = await response.json()
    return visitadores
  } catch (error) {
    console.error('Error obteniendo visitadores:', error)
    return []
  }
}
