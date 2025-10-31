'use server'

import { Vehiculo } from '@/types'
import { getAccessToken } from './auth'
import { fetchWithErrorHandling } from '@/lib/fetchWithErrorHandling'

const baseUrl =
  process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000/api/vehiculos'

export async function obtenerVehiculosDisponibles(): Promise<Vehiculo[]> {
  try {
    const token = await getAccessToken()
    const response = await fetchWithErrorHandling(`${baseUrl}/vehiculos`, {
      method: 'GET',
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
      cache: 'force-cache',
    })

    const vehiculos: Vehiculo[] = await response.json()
    return vehiculos
  } catch (error) {
    console.error('Error al obtener vehículos disponibles para entrega:', error)
    throw error
  }
}

export async function obtenerVehiculo(
  patente: string
): Promise<Vehiculo | null> {
  try {
    const token = await getAccessToken()
    const response = await fetchWithErrorHandling(`${baseUrl}/${patente}`, {
      method: 'GET',
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
    })

    const vehiculo: Vehiculo = await response.json()
    return vehiculo
  } catch (error) {
    console.error('Error al obtener vehículo:', error)
    throw error
  }
}
