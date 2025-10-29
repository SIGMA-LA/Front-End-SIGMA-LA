'use server'

import { Cliente } from '@/types'
import { getAccessToken } from './auth'
import { revalidatePath } from 'next/cache'
import { fetchWithErrorHandling } from '@/lib/fetchWithErrorHandling'

const API_BASE = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000/api'
const baseUrl = API_BASE.endsWith('/clientes')
  ? API_BASE
  : `${API_BASE}/clientes`

/* Obtener todos los clientes */
export async function obtenerClientes(): Promise<Cliente[]> {
  try {
    const token = await getAccessToken()
    const res = await fetchWithErrorHandling(`${baseUrl}`, {
      method: 'GET',
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
    })
    const data = await res.json()
    return Array.isArray(data) ? (data as Cliente[]) : []
  } catch (error) {
    console.error('[obtenerClientes]', error)
    return []
  }
}

/* Obtener cliente por CUIL */
export async function obtenerCliente(cuil: string): Promise<Cliente | null> {
  if (!cuil) return null
  try {
    const token = await getAccessToken()
    const res = await fetchWithErrorHandling(
      `${baseUrl}/${encodeURIComponent(cuil)}`,
      {
        method: 'GET',
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      }
    )
    return (await res.json()) as Cliente
  } catch (error) {
    console.error('[obtenerCliente]', error)
    return null
  }
}

/* Crear cliente */
export async function crearCliente(
  formData: FormData
): Promise<Cliente | null> {
  try {
    const token = await getAccessToken()
    const res = await fetchWithErrorHandling(`${baseUrl}`, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(formData),
    })
    const data = await res.json()
    try {
      revalidatePath('/coordinacion/clientes')
      revalidatePath('/ventas/clientes')
    } catch (_) {}
    return data ? (data as Cliente) : null
  } catch (error) {
    console.error('[crearCliente]', error)
    return null
  }
}

/* Actualizar cliente */
export async function actualizarCliente(
  cuil: string,
  clienteData: Partial<Cliente>
): Promise<Cliente | null> {
  if (!cuil) return null
  try {
    const token = await getAccessToken()
    const res = await fetchWithErrorHandling(
      `${baseUrl}/${encodeURIComponent(cuil)}`,
      {
        method: 'PUT',
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(clienteData),
      }
    )
    const data = await res.json()
    try {
      revalidatePath('/coordinacion/clientes')
      revalidatePath('/ventas/clientes')
    } catch (_) {}
    return data ? (data as Cliente) : null
  } catch (error) {
    console.error('[actualizarCliente]', error)
    return null
  }
}

/* Eliminar cliente */
export async function eliminarCliente(
  cuil: string
): Promise<{ success: boolean; error?: string }> {
  if (!cuil) return { success: false, error: 'CUIL inválido' }
  try {
    const token = await getAccessToken()
    await fetchWithErrorHandling(`${baseUrl}/${encodeURIComponent(cuil)}`, {
      method: 'DELETE',
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
    })
    try {
      revalidatePath('/coordinacion/clientes')
      revalidatePath('/ventas/clientes')
    } catch (_) {}
    return { success: true }
  } catch (error: any) {
    console.error('[eliminarCliente]', error)
    return { success: false, error: error?.message ?? 'Error desconocido' }
  }
}

/* Obtener obras de un cliente */
export async function obtenerObrasCliente(cuil: string): Promise<any[]> {
  if (!cuil) return []
  try {
    const token = await getAccessToken()
    const res = await fetchWithErrorHandling(
      `${baseUrl}/${encodeURIComponent(cuil)}/obras`,
      {
        method: 'GET',
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      }
    )
    const data = await res.json()
    return Array.isArray(data) ? data : []
  } catch (error) {
    console.error('[obtenerObrasCliente]', error)
    return []
  }
}
