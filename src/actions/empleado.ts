'use server'

import { Empleado } from '@/types'
import { getAccessToken } from './auth'
import { fetchWithErrorHandling } from '@/lib/fetchWithErrorHandling'
import { logError } from '@/lib/logger'

const baseUrl = process.env.NEXT_PUBLIC_API_URL + '/empleados'

interface ApiResponse<T> {
  success: boolean
  data: T
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
    logError(error, 'obtenerVisitadores')
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
    logError(error, 'obtenerEmpleadosDisponiblesParaEntrega')
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
    logError(error, 'buscarFiltrados')
    throw error
  }
}

export async function obtenerEmpleadoPorCuil(
  cuil: string
): Promise<Empleado | null> {
  if (!cuil) {
    logError(
      new Error('Se intentó obtener un empleado sin CUIL'),
      'obtenerEmpleadoPorCuil'
    )
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
    logError(error, `obtenerEmpleadoPorCuil:${cuil}`)
    return null
  }
}

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

    const data: ApiResponse<Empleado[]> = await response.json()
    return data.data || []
  } catch (error) {
    logError(error, 'obtenerTodosLosEmpleados')
    return []
  }
}

/* Crear empleado (POST /empleados) */
export async function crearEmpleado(empleadoData: {
  cuil: string
  nombre: string
  apellido: string
  rol_actual: string
  area_trabajo: string
  contrasenia?: string
}): Promise<{ success: boolean; data?: Empleado; error?: string }> {
  try {
    const token = await getAccessToken()
    const response = await fetchWithErrorHandling(`${baseUrl}`, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(empleadoData),
    })

    if (!response.ok) {
      return { success: false, error: 'Error al crear empleado' }
    }

    const empleado: Empleado = await response.json()
    return { success: true, data: empleado }
  } catch (error) {
    logError(error, 'crearEmpleado')
    return { success: false, error: 'Error al crear empleado' }
  }
}

/* Actualizar empleado (PUT /empleados/:cuil) */
export async function actualizarEmpleado(
  cuil: string,
  empleadoData: {
    nombre?: string
    apellido?: string
    rol_actual?: string
    area_trabajo?: string
    contrasenia?: string
  }
): Promise<{ success: boolean; data?: Empleado; error?: string }> {
  try {
    const token = await getAccessToken()
    const response = await fetchWithErrorHandling(`${baseUrl}/${cuil}`, {
      method: 'PUT',
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(empleadoData),
    })

    if (!response.ok) {
      return { success: false, error: 'Error al actualizar empleado' }
    }

    const empleado: Empleado = await response.json()
    return { success: true, data: empleado }
  } catch (error) {
    logError(error, 'actualizarEmpleado')
    return { success: false, error: 'Error al actualizar empleado' }
  }
}

/* Eliminar empleado (DELETE /empleados/:cuil) */
export async function eliminarEmpleado(
  cuil: string
): Promise<{ success: boolean; error?: string }> {
  try {
    const token = await getAccessToken()
    const response = await fetchWithErrorHandling(`${baseUrl}/${cuil}`, {
      method: 'DELETE',
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
    })

    if (!response.ok) {
      return { success: false, error: 'Error al eliminar empleado' }
    }

    return { success: true }
  } catch (error) {
    logError(error, 'eliminarEmpleado')
    return { success: false, error: 'Error al eliminar empleado' }
  }
}
