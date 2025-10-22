'use server'

import { Obra } from '@/types'
import { getAccessToken } from './auth'

const baseUrl = 'http://localhost:4000/api/obras'

export async function obtenerObras(): Promise<Obra[]> {
  try {
    const token = await getAccessToken()
    const response = await fetch(`${baseUrl}`, {
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
      throw new Error('Error al obtener las obras.')
    }
    const data = await response.json()
    return data
  } catch (error) {
    console.error('Error al obtener las obras:', error)
    throw new Error('Error al obtener las obras.')
  }
}

export async function obtenerObra(id: number): Promise<Obra> {
  try {
    const token = await getAccessToken()
    const response = await fetch(`${baseUrl}/${id}`, {
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
      throw new Error('Error al obtener la obra.')
    }
    const data = await response.json()
    return data
  } catch (error) {
    console.error('Error al obtener la obra:', error)
    throw new Error('Error al obtener la obra.')
  }
}

export async function filtrarObras({
  estado,
  cod_localidad,
}: {
  estado?: string
  cod_localidad?: number
}): Promise<Obra[]> {
  try {
    const token = await getAccessToken()
    const params = new URLSearchParams()
    if (estado) params.append('estado', estado)
    if (cod_localidad) params.append('localidad', cod_localidad.toString())
    const response = await fetch(`${baseUrl}/filtrar?${params.toString()}`, {
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
      throw new Error('Error al filtrar las obras.')
    }
    const data = await response.json()
    return data
  } catch (error) {
    console.error('Error al filtrar las obras:', error)
    throw new Error('Error al filtrar las obras.')
  }
}

export async function deleteObra(
  id: number
): Promise<{ success: boolean; error?: string }> {
  try {
    const token = await getAccessToken()
    const response = await fetch(`${baseUrl}/${id}`, {
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

export async function uploadNotaFabrica(
  codObra: number,
  file: FormData
): Promise<Obra> {
  try {
    const token = await getAccessToken()
    const response = await fetch(`${baseUrl}/${codObra}/nota-fabrica`, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${token}`,
      },
      body: file,
    })

    if (!response.ok) {
      if (response.status === 401) {
        throw new Error('Token expirado. Por favor, inicia sesión nuevamente.')
      }
      throw new Error('Error al subir la nota de fábrica.')
    }

    const data = await response.json()
    return data
  } catch (error) {
    console.error('Error al subir la nota de fábrica:', error)
    throw new Error('Error al subir la nota de fábrica.')
  }
}

export async function deleteNotaFabrica(codObra: number): Promise<Obra> {
  try {
    const token = await getAccessToken()
    const response = await fetch(`${baseUrl}/${codObra}/nota-fabrica`, {
      method: 'DELETE',
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
    })

    if (!response.ok) {
      if (response.status === 401) {
        throw new Error('Token expirado. Por favor, inicia sesión nuevamente.')
      }
      throw new Error('Error al eliminar la nota de fábrica.')
    }

    const data = await response.json()
    return data
  } catch (error) {
    console.error('Error al eliminar la nota de fábrica:', error)
    throw new Error('Error al eliminar la nota de fábrica.')
  }
}

// Función para traer obras con datos completos incluyendo presupuesto y pagos
export async function obtenerObrasCompletas({
  estado,
  cod_localidad,
}: {
  estado?: string
  cod_localidad?: number
}): Promise<Obra[]> {
  try {
    const token = await getAccessToken()
    const params = new URLSearchParams()
    if (estado) params.append('estado', estado)
    if (cod_localidad) params.append('localidad', cod_localidad.toString())

    // Usamos un endpoint específico que incluye presupuesto y pagos
    const response = await fetch(`${baseUrl}/completas?${params.toString()}`, {
      method: 'GET',
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
    })

    if (!response.ok) {
      // Si el endpoint no existe, fallback a filtrar obras
      console.log('Endpoint /completas no disponible, usando /filtrar')
      return await filtrarObras({ estado, cod_localidad })
    }

    const data = await response.json()
    return data
  } catch (error) {
    console.error(
      'Error al obtener obras completas, usando filtrar como fallback:',
      error
    )
    // Fallback a la función original
    return await filtrarObras({ estado, cod_localidad })
  }
}
