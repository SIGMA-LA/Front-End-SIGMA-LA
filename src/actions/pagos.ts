'use server'
import { Pago, PagoFormData } from '@/types'
import { getAccessToken } from './auth'

const baseUrl =
  process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000/api/pagos'

export async function getAllPagos(): Promise<Pago[]> {
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
        `Error al cargar los pagos: ${response.status} - ${errorText}`
      )
    }
    const data = await response.json()
    return data
  } catch (error) {
    console.error('Error en obtenerPagosSemana:', error)
    throw error
  }
}

export async function getPagosObra(cod_obra: number): Promise<Pago[]> {
  try {
    const token = await getAccessToken()
    const response = await fetch(`${baseUrl}/obra/${cod_obra}`, {
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
        `Error al cargar los pagos: ${response.status} - ${errorText}`
      )
    }

    const data = await response.json()
    console.log('Pagos obtenidos para la obra:', data)
    return data
  } catch (error) {
    console.error('Error en obtenerVisitas:', error)
    throw error
  }
}

export async function deletePago(cod_pago: number): Promise<void> {
  try {
    const token = await getAccessToken()
    console.log(cod_pago)
    const response = await fetch(`${baseUrl}/${cod_pago}`, {
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
      const errorText = await response.text()
      throw new Error(
        `Error al eliminar el pago: ${response.status} - ${errorText}`
      )
    }
  } catch (error) {
    console.error('Error en eliminar Pago:', error)
    throw error
  }
}

export async function createPagoForObra(
  pagoData: PagoFormData,
  cod_obra: number
): Promise<Pago> {
  try {
    const token = await getAccessToken()
    const response = await fetch(`${baseUrl}/obra/${cod_obra}`, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(pagoData),
    })

    if (!response.ok) {
      if (response.status === 401) {
        throw new Error('Token expirado. Por favor, inicia sesión nuevamente.')
      }
      throw new Error('Error al crear el pago')
    }

    const data = await response.json()
    return data
  } catch (error) {
    console.error('Error en crear Pago:', error)
    throw error
  }
}

export async function updatePago(pagoData: Pago): Promise<Pago> {
  try {
    const token = await getAccessToken()
    const response = await fetch(`${baseUrl}/${pagoData.cod_pago}`, {
      method: 'PUT',
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(pagoData),
    })
    if (!response.ok) {
      if (response.status === 401) {
        throw new Error('Token expirado. Por favor, inicia sesión nuevamente.')
      }
      const errorText = await response.text()
      throw new Error(
        `Error al actualizar el pago: ${response.status} - ${errorText}`
      )
    }
    const data = await response.json()
    return data
  } catch (error) {
    console.error('Error en actualizar Pago:', error)
    throw error
  }
}
