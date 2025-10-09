'use server'

import { getAccessToken } from './auth'
import { Visita, CrearVisita } from '@/types'

const baseUrl =
  process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000/api/visitas'

export async function obtenerVisitaPorId(id: number): Promise<Visita | null> {
  try {
    const token = await getAccessToken()
    const response = await fetch(`${baseUrl}/${id}`, {
      method: 'GET',
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
      cache: 'no-store',
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

export async function cancelarVisita(id: number): Promise<Visita> {
  try {
    const token = await getAccessToken()
    const visita = await obtenerVisitaPorId(id)
    if (!visita) {
      throw new Error('Visita no encontrada')
    }

    const updatePayload: any = {
      estado: 'CANCELADA',
      fecha_hora_visita: new Date(visita.fecha_hora_visita)
        .toISOString()
        .replace(/\.\d{3}Z$/, 'Z'),
      fecha_cancelacion: new Date().toISOString().slice(0, 10),
    }
    console.log('Update payload for cancelarVisita:', updatePayload)

    const response = await fetch(`${baseUrl}/${id}`, {
      method: 'PUT',
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(updatePayload),
    })
    console.log('Response from cancelarVisita:', response)
    if (!response.ok) {
      if (response.status === 401) {
        throw new Error('Token expirado. Por favor, inicia sesión nuevamente.')
      }
      const errorText = await response.text()
      throw new Error(
        `Error al cancelar la visita: ${response.status} - ${errorText}`
      )
    }
    const data = await response.json()
    return data
  } catch (error) {
    console.error('Error en cancelarVisita:', error)
    throw error
  }
}

export async function obtenerVisitas(): Promise<Visita[]> {
  try {
    const token = await getAccessToken()

    console.log('Using API URL:', baseUrl)

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

export async function crearVisita(visitaData: CrearVisita): Promise<Visita> {
  try {
    const token = await getAccessToken()
    console.log('Creating visita with data:', visitaData)
    const response = await fetch(`${baseUrl}`, {
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

export async function actualizarVisita(
  id: number,
  visitaData: Partial<CrearVisita>
): Promise<Visita> {
  try {
    const token = await getAccessToken()
    console.log('Updating visita with data:', visitaData)
    const response = await fetch(`${baseUrl}/${id}`, {
      method: 'PUT',
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
      throw new Error('Error al actualizar la visita')
    }
    const data = await response.json()
    return data
  } catch (error) {
    console.error('Error en actualizarVisita:', error)
    throw error
  }
}
