'use server'

import { getAccessToken } from './auth'
import { fetchWithErrorHandling } from '@/lib/fetchWithErrorHandling'
import { Vehiculo, VehiculoFormData } from '@/types'

const API_URL = process.env.NEXT_PUBLIC_API_URL + '/vehiculos'

export async function obtenerVehiculos(): Promise<Vehiculo[]> {
  const token = await getAccessToken()
  const res = await fetchWithErrorHandling(`${API_URL}`, {
    method: 'GET',
    headers: {
      Authorization: `Bearer ${token}`,
      'Content-Type': 'application/json',
    },
    cache: 'no-store',
  })
  return res.json()
}

export async function obtenerVehiculo(patente: string): Promise<Vehiculo> {
  const token = await getAccessToken()
  const res = await fetchWithErrorHandling(`${API_URL}/${patente}`, {
    method: 'GET',
    headers: {
      Authorization: `Bearer ${token}`,
      'Content-Type': 'application/json',
    },
    cache: 'no-store',
  })
  const data = await res.json()
  console.log('Datos recibidos del backend para vehículo:', patente, data)
  return data
}

export async function crearVehiculo(data: VehiculoFormData): Promise<Vehiculo> {
  console.log('📝 Datos recibidos en crearVehiculo:', data)
  const token = await getAccessToken()
  const res = await fetchWithErrorHandling(`${API_URL}`, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${token}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(data),
  })
  const result = await res.json()
  console.log('✅ Respuesta del backend al crear:', result)
  return result
}

export async function actualizarVehiculo(
  patente: string,
  data: Partial<VehiculoFormData>
): Promise<Vehiculo> {
  const token = await getAccessToken()
  const res = await fetchWithErrorHandling(`${API_URL}/${patente}`, {
    method: 'PUT',
    headers: {
      Authorization: `Bearer ${token}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(data),
  })
  return res.json()
}

export async function eliminarVehiculo(patente: string): Promise<void> {
  const token = await getAccessToken()
  await fetchWithErrorHandling(`${API_URL}/${patente}`, {
    method: 'DELETE',
    headers: {
      Authorization: `Bearer ${token}`,
      'Content-Type': 'application/json',
    },
  })
}
