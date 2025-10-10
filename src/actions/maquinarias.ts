'use server'

import { cookies } from 'next/headers'
import { revalidatePath } from 'next/cache'
import { Maquinaria } from '@/types'

const baseUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000/api'

async function getAccessToken(): Promise<string> {
  const cookieStore = await cookies()
  const accessToken = cookieStore.get('accessToken')?.value

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

// Obtener todas las maquinarias
export async function getMaquinarias(): Promise<Maquinaria[]> {
  try {
    const token = await getAccessToken()

    const response = await fetch(`${baseUrl}/maquinarias`, {
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
        `Error al cargar las maquinarias: ${response.status} - ${errorText}`
      )
    }

    const data = await response.json()
    revalidatePath('/dashboard')
    return data
  } catch (error) {
    console.error('Error al obtener maquinarias:', error)
    throw error
  }
}

// Obtener maquinarias disponibles
export async function getMaquinariasDisponibles(): Promise<Maquinaria[]> {
  try {
    const token = await getAccessToken()

    const response = await fetch(`${baseUrl}/maquinarias/disponibles`, {
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
        `Error al cargar las maquinarias disponibles: ${response.status} - ${errorText}`
      )
    }

    const data = await response.json()
    return data
  } catch (error) {
    console.error('Error al obtener maquinarias disponibles:', error)
    throw error
  }
}

// Obtener maquinaria por ID
export async function getMaquinariaById(id: number): Promise<Maquinaria> {
  try {
    const token = await getAccessToken()

    const response = await fetch(`${baseUrl}/maquinarias/${id}`, {
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
      if (response.status === 404) {
        throw new Error('Maquinaria no encontrada')
      }
      const errorText = await response.text()
      throw new Error(
        `Error al obtener la maquinaria: ${response.status} - ${errorText}`
      )
    }

    const data = await response.json()
    return data
  } catch (error) {
    console.error('Error al obtener maquinaria por ID:', error)
    throw error
  }
}

// Crear nueva maquinaria
export async function createMaquinaria(
  maquinariaData: Omit<Maquinaria, 'cod_maquina'>
): Promise<Maquinaria> {
  try {
    const token = await getAccessToken()

    const response = await fetch(`${baseUrl}/maquinarias`, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(maquinariaData),
    })

    if (!response.ok) {
      if (response.status === 401) {
        throw new Error('Token expirado. Por favor, inicia sesión nuevamente.')
      }
      const errorText = await response.text()
      throw new Error(
        `Error al crear la maquinaria: ${response.status} - ${errorText}`
      )
    }

    const data = await response.json()
    revalidatePath('/dashboard')
    return data
  } catch (error) {
    console.error('Error al crear maquinaria:', error)
    throw error
  }
}

// Actualizar maquinaria
export async function updateMaquinaria(
  id: number,
  maquinariaData: Partial<Maquinaria>
): Promise<Maquinaria> {
  try {
    const token = await getAccessToken()

    const response = await fetch(`${baseUrl}/maquinarias/${id}`, {
      method: 'PUT',
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(maquinariaData),
    })

    if (!response.ok) {
      if (response.status === 401) {
        throw new Error('Token expirado. Por favor, inicia sesión nuevamente.')
      }
      if (response.status === 404) {
        throw new Error('Maquinaria no encontrada')
      }
      const errorText = await response.text()
      throw new Error(
        `Error al actualizar la maquinaria: ${response.status} - ${errorText}`
      )
    }

    const data = await response.json()
    revalidatePath('/dashboard')
    return data
  } catch (error) {
    console.error('Error al actualizar maquinaria:', error)
    throw error
  }
}

// Actualizar estado de maquinaria
export async function updateEstadoMaquinaria(
  id: number,
  estado: string
): Promise<Maquinaria> {
  try {
    const token = await getAccessToken()

    const response = await fetch(`${baseUrl}/maquinarias/${id}/estado`, {
      method: 'PUT',
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ estado }),
    })

    if (!response.ok) {
      if (response.status === 401) {
        throw new Error('Token expirado. Por favor, inicia sesión nuevamente.')
      }
      if (response.status === 404) {
        throw new Error('Maquinaria no encontrada')
      }
      const errorText = await response.text()
      throw new Error(
        `Error al actualizar el estado: ${response.status} - ${errorText}`
      )
    }

    const data = await response.json()
    revalidatePath('/dashboard')
    return data
  } catch (error) {
    console.error('Error al actualizar estado de maquinaria:', error)
    throw error
  }
}

// Eliminar maquinaria
export async function deleteMaquinaria(id: number): Promise<void> {
  try {
    const token = await getAccessToken()

    const response = await fetch(`${baseUrl}/maquinarias/${id}`, {
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
      if (response.status === 404) {
        throw new Error('Maquinaria no encontrada')
      }
      const errorText = await response.text()
      throw new Error(
        `Error al eliminar la maquinaria: ${response.status} - ${errorText}`
      )
    }

    revalidatePath('/dashboard')
  } catch (error) {
    console.error('Error al eliminar maquinaria:', error)
    throw error
  }
}
