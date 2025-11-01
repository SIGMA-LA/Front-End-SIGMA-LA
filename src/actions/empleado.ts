'use server'

import { Empleado } from '@/types'
import { getAccessToken } from './auth'
import { fetchWithErrorHandling } from '@/lib/fetchWithErrorHandling'

const baseUrl = process.env.NEXT_PUBLIC_API_URL + '/empleados'

export async function obtenerEmpleadoActual(): Promise<Empleado | null> {
  try {
    const token = await getAccessToken()
    const response = await fetchWithErrorHandling(`${baseUrl}/me`, {
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

export async function obtenerVisitadores(): Promise<Empleado[]> {
  try {
    const token = await getAccessToken()
    const response = await fetchWithErrorHandling(`${baseUrl}/visitadores`, {
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

export async function getDisponiblesParaEntrega(): Promise<Empleado[]> {
  try {
    const token = await getAccessToken()
    const response = await fetchWithErrorHandling(
      `${baseUrl}/disponibles-entrega`,
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

    const empleados: Empleado[] = await response.json()
    return empleados
  } catch (error) {
    console.error('Error al obtener empleados disponibles para entrega:', error)
    throw error
  }
}

export async function buscarFiltrados(query: string): Promise<Empleado[]> {
  try {
    const token = await getAccessToken()
    const response = await fetchWithErrorHandling(
      `${baseUrl}/buscar?${query}`,
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

    const empleados: Empleado[] = await response.json()
    return empleados
  } catch (error) {
    console.error('Error al buscar acompañantes:', error)
    throw error
  }
}

export async function obtenerEmpleadoPorCuil(
  cuil: string
): Promise<Empleado | null> {
  if (!cuil) {
    console.warn('Se intentó obtener un empleado sin CUIL.')
    return null
  }

  try {
    const token = await getAccessToken()
    const response = await fetchWithErrorHandling(`${baseUrl}/${cuil}`, {
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
    console.error(`Error obteniendo empleado con CUIL ${cuil}:`, error)
    return null
  }
}

obtenerTodosLosEmpleados
export async function obtenerTodosLosEmpleados(): Promise<Empleado[]> {
  try {
    const token = await getAccessToken()
    const response = await fetchWithErrorHandling(`${baseUrl}`, {
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

    const data = await response.json()
    return data.data || []
  } catch (error) {
    console.error('Error obteniendo todos los empleados:', error)
    return []
  }
}
