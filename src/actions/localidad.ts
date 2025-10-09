'use server'

import { Empleado, Localidad, Provincia } from '@/types'
import { getAccessToken } from './auth'

const baseUrl =
  process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000/api/provincias'

export async function obtenerProvincias(): Promise<Provincia[]> {
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

    const provincias: Provincia[] = await response.json()
    return provincias
  } catch (error) {
    console.error('Error obteniendo empleado actual:', error)
    return []
  }
}

export async function obtenerProvinciaById(
  cod_provincia: number
): Promise<Provincia | null> {
  try {
    const token = await getAccessToken()
    const response = await fetch(`${baseUrl}/${cod_provincia}`, {
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
    const provincia: Provincia = await response.json()
    return provincia
  } catch (error) {
    console.error('Error obteniendo provincia por ID:', error)
    return null
  }
}

export async function localidadesPorProvincia(
  cod_provincia: number
): Promise<Localidad[]> {
  try {
    const token = await getAccessToken()
    const response = await fetch(
      `http://localhost:4000/api/localidades/provincias/${cod_provincia}`,
      {
        method: 'GET',
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        cache: 'no-store',
      }
    )

    if (!response.ok) {
      return []
    }

    const localidades: Localidad[] = await response.json()
    return localidades
  } catch (error) {
    console.error('Error obteniendo localidades por provincia:', error)
    return []
  }
}
