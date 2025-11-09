'use server'

import { Localidad, Provincia } from '@/types'
import { getAccessToken } from './auth'

const baseUrl = process.env.NEXT_PUBLIC_API_URL + '/provincias'

// DEPRECADA - Usar getProvincias() de src/lib/cache.ts
export async function obtenerProvincias(): Promise<Provincia[]> {
  try {
    const token = await getAccessToken()
    const response = await fetch(`${baseUrl}`, {
      method: 'GET',
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
      next: { revalidate: 3600 }, // 1 hora
    })

    if (!response.ok) {
      return []
    }

    return response.json()
  } catch (error) {
    console.error('Error obteniendo provincias:', error)
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
      `${process.env.NEXT_PUBLIC_API_URL}/api/localidades/provincias/${cod_provincia}`,
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
