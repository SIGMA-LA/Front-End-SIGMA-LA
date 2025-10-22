'use server'

import { Vehiculo } from '@/types'
import { getAccessToken } from './auth'

const baseUrl =
  process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000/api/vehiculos'

export async function obtenerVehiculosDisponibles(): Promise<Vehiculo[]> {
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

    const empleados: Vehiculo[] = await response.json()
    return empleados
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
    const response = await fetch(`${baseUrl}/${patente}`, {
      method: 'GET',
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
    })

    if (!response.ok) {
      return null
    }

    const vehiculo: Vehiculo = await response.json()
    return vehiculo
  } catch (error) {
    console.error('Error al obtener vehículo:', error)
    throw error
  }
}
