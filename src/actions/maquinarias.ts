'use server'

import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'
import { fetchWithErrorHandling } from '@/lib/fetchWithErrorHandling'
import { getAccessToken } from './auth'
import type { Maquinaria } from '@/types'

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000/api'
const BASE_URL = `${API_URL}/maquinarias`

/**
 * Retrieves all maquinarias from the system
 * @returns {Promise<Maquinaria[]>} List of all maquinarias
 */
export async function getMaquinarias(): Promise<Maquinaria[]> {
  const token = await getAccessToken()
  const res = await fetchWithErrorHandling(BASE_URL, {
    headers: { Authorization: `Bearer ${token}` },
    next: { revalidate: 30, tags: ['maquinarias'] },
  })
  return res.json()
}

/**
 * Retrieves all available maquinarias (not currently assigned)
 * @returns {Promise<Maquinaria[]>} List of available maquinarias
 */
export async function getMaquinariasDisponibles(): Promise<Maquinaria[]> {
  const token = await getAccessToken()
  const res = await fetchWithErrorHandling(`${BASE_URL}/disponibles`, {
    headers: { Authorization: `Bearer ${token}` },
    next: { revalidate: 30, tags: ['maquinarias', 'maquinarias-disponibles'] },
  })
  return res.json()
}

/**
 * Retrieves a single maquinaria by ID
 * @param {number} id - Maquinaria ID
 * @returns {Promise<Maquinaria>} Maquinaria data
 */
export async function getMaquinaria(id: number): Promise<Maquinaria> {
  const token = await getAccessToken()
  const res = await fetchWithErrorHandling(`${BASE_URL}/${id}`, {
    headers: { Authorization: `Bearer ${token}` },
    next: { revalidate: 30, tags: [`maquinaria-${id}`] },
  })
  return res.json()
}

/**
 * Creates a new maquinaria and redirects to the list
 * @param {Partial<Maquinaria>} data - Maquinaria data
 */
export async function createMaquinaria(data: Partial<Maquinaria>) {
  const token = await getAccessToken()

  await fetchWithErrorHandling(BASE_URL, {
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

/**
 * Updates an existing maquinaria and redirects to the list
 * @param {number} id - Maquinaria ID
 * @param {Partial<Maquinaria>} data - Fields to update
 */
export async function updateMaquinaria(id: number, data: Partial<Maquinaria>) {
  const token = await getAccessToken()

  await fetchWithErrorHandling(`${BASE_URL}/${id}`, {
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

/**
 * Deletes a maquinaria
 * @param {number} id - Maquinaria ID
 * @returns {Promise<{success: boolean}>} Operation result
 */
export async function deleteMaquinaria(id: number) {
  const token = await getAccessToken()

  await fetchWithErrorHandling(`${BASE_URL}/${id}`, {
    method: 'DELETE',
    headers: { Authorization: `Bearer ${token}` },
  })

  revalidatePath('/coordinacion/maquinarias')
  return { success: true }
}
