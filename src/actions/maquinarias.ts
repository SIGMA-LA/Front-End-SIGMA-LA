'use server'

import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'
import { getAccessToken } from './auth'
import { fetchWithErrorHandling } from '@/lib/fetchWithErrorHandling'
import type { Maquinaria } from '@/types'

const baseUrl = process.env.NEXT_PUBLIC_API_URL + '/maquinarias'

// GET - Obtener todas las maquinarias
export async function getMaquinarias(): Promise<Maquinaria[]> {
  const token = await getAccessToken()
  const response = await fetchWithErrorHandling(baseUrl, {
    headers: { Authorization: `Bearer ${token}` },
    cache: 'no-store',
  })
  return response.json()
}

// GET - Obtener maquinarias disponibles
export async function getMaquinariasDisponibles(): Promise<Maquinaria[]> {
  const token = await getAccessToken()
  const response = await fetchWithErrorHandling(`${baseUrl}/disponibles`, {
    headers: { Authorization: `Bearer ${token}` },
    cache: 'no-store',
  })
  return response.json()
}

// GET - Obtener una maquinaria por ID
export async function getMaquinariaById(id: number): Promise<Maquinaria> {
  const token = await getAccessToken()
  const response = await fetchWithErrorHandling(`${baseUrl}/${id}`, {
    headers: { Authorization: `Bearer ${token}` },
    cache: 'no-store',
  })
  return response.json()
}

// POST - Crear maquinaria
export async function createMaquinaria(data: Partial<Maquinaria>) {
  const token = await getAccessToken()

  await fetchWithErrorHandling(baseUrl, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${token}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(data),
  })

  revalidatePath('/coordinacion/maquinarias')
  redirect('/coordinacion/maquinarias')
}

// PUT - Actualizar maquinaria
export async function updateMaquinaria(id: number, data: Partial<Maquinaria>) {
  const token = await getAccessToken()

  await fetchWithErrorHandling(`${baseUrl}/${id}`, {
    method: 'PUT',
    headers: {
      Authorization: `Bearer ${token}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(data),
  })

  revalidatePath('/coordinacion/maquinarias')
  redirect('/coordinacion/maquinarias')
}

// DELETE - Eliminar maquinaria
export async function deleteMaquinaria(id: number) {
  const token = await getAccessToken()

  await fetchWithErrorHandling(`${baseUrl}/${id}`, {
    method: 'DELETE',
    headers: { Authorization: `Bearer ${token}` },
  })

  revalidatePath('/coordinacion/maquinarias')
  return { success: true }
}
