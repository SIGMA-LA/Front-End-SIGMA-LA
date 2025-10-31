'use server'

import { getAccessToken } from './auth'
import { Visita, CrearVisita } from '@/types'
import { fetchWithErrorHandling } from '@/lib/fetchWithErrorHandling'

const baseUrl = process.env.NEXT_PUBLIC_API_URL + '/visitas'

/**
 * Obtiene una visita por su ID
 */
export async function obtenerVisitaPorId(id: number): Promise<Visita | null> {
  const token = await getAccessToken()
  const response = await fetchWithErrorHandling(`${baseUrl}/${id}`, {
    method: 'GET',
    headers: {
      Authorization: `Bearer ${token}`,
      'Content-Type': 'application/json',
    },
    cache: 'no-store',
  })
  return response.ok ? await response.json() : null
}

/**
 * Cancela una visita por ID
 */
export async function cancelarVisita(id: number): Promise<Visita> {
  const token = await getAccessToken()
  const visita = await obtenerVisitaPorId(id)
  if (!visita) throw new Error('Visita no encontrada')

  const updatePayload = {
    estado: 'CANCELADA',
    fecha_hora_visita: new Date(visita.fecha_hora_visita)
      .toISOString()
      .replace(/\.\d{3}Z$/, 'Z'),
    fecha_cancelacion: new Date().toISOString().slice(0, 10),
  }

  const response = await fetchWithErrorHandling(`${baseUrl}/${id}`, {
    method: 'PUT',
    headers: {
      Authorization: `Bearer ${token}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(updatePayload),
  })
  return await response.json()
}

/**
 * Obtiene todas las visitas
 */
export async function obtenerVisitas(): Promise<Visita[]> {
  const token = await getAccessToken()
  const response = await fetchWithErrorHandling(`${baseUrl}`, {
    method: 'GET',
    headers: {
      Authorization: `Bearer ${token}`,
      'Content-Type': 'application/json',
    },
  })
  return await response.json()
}

/**
 * Crea una nueva visita
 */
export async function crearVisita(visitaData: CrearVisita): Promise<Visita> {
  const token = await getAccessToken()
  const response = await fetchWithErrorHandling(`${baseUrl}`, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${token}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(visitaData),
  })
  return await response.json()
}

/**
 * Actualiza una visita existente
 */
export async function actualizarVisita(
  id: number,
  visitaData: Partial<CrearVisita>
): Promise<Visita> {
  const token = await getAccessToken()
  const response = await fetchWithErrorHandling(`${baseUrl}/${id}`, {
    method: 'PUT',
    headers: {
      Authorization: `Bearer ${token}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(visitaData),
  })
  return await response.json()
}
